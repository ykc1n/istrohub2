/* eslint no-use-before-define: 0 */

import { Canvas,Image,loadImage, createCanvas } from 'canvas';
import {parts} from './parts'
import {atlasjson} from 'src/app/shipey/atlas'
const NxN = 24;
const SIZE = 20;
const MARGIN = 40;
const LIMIT = 6;
const BG_COLOR = "rgba(203,213,225,0)";
const BOX_COLOR = "rgba(255,255,225,.1)"
const mappings = atlasjson.mappings;
const size = atlasjson.size;
const atlasSize = size;

type ColorMode = "color" | "replace"
type Color = [number,number,number,number] | [number,number,number] | number[]



let atlas:Image | null = null;

// await loadImage("/atlas.png").then(image => {
//     console.log("loaded!")
//     atlas = image});

export function hexToRgb(hex:string){
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [255,255,255];
}


export function drawImage(ctx:CanvasRenderingContext2D, file:string, x:number, y:number, w = SIZE, h = SIZE, dir = 0, flip = false, color:Color, colorMode:ColorMode) {
    if(!atlas) {
        //console.log("Not ready");
        return;
    }

    const img = getImage(file, flip, color, colorMode);


    

    if(img != null) {
        ctx.save();
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(-dir * Math.PI / 2);
        ctx.translate(-x - w / 2, -y - h / 2);

        ctx.drawImage(img as unknown as CanvasImageSource, x, y, w, h);

        ctx.restore();
    }
}

export function drawPart(ctx:CanvasRenderingContext2D, name:string, x:number, y:number, dir:number, color:Color){
    if(!parts[name]) {
        //console.log("Unknown part", name);
        return;
    }

    var file = "parts/" + parts[name].image;
    var size = parts[name].size;

    let wt = size[0] * SIZE;
    let ht = size[1] * SIZE;
    if(name.includes("Turret") || name.includes("Gun")) {
        wt *= 2.3;
        ht *= 2.3;
    }

    let xt = NxN / 2 * SIZE + x - wt / 2;
    let yt = NxN / 2 * SIZE - y - ht / 2;
    let flip = x < 0 && parts[name].flip;

    if(parts[name].northWest && dir % 2 !== 0)
        file = file.replace("N", "W")

    let mode = null;
    if(isDecal(name))
        mode = "color";
    else if(hasColor(name))
        mode = "replace";

    drawImage(ctx, file, xt, yt, wt, ht, dir, flip, color, mode);

    if(name === "JumpEngine")
        drawImage(ctx, "parts/engineJumpPip.png", xt, yt, wt, ht, -dir * Math.PI / 2, flip);
}

export async function drawShip(spec:unknown, stats:object, color:Color = [255, 255, 255, 255]) {
    
    if(atlas==null){
        await loadImage("/atlas.png").then(image=>{
            console.log("loaded image in client!")
            atlas = image
        })
    }
    
    const canvas = createCanvas(NxN * SIZE + MARGIN, NxN * SIZE + MARGIN);
    const ctx = canvas.getContext('2d');

    // Scale canvas when ship's too big
    let maxSize =  NxN * SIZE / 2;
 
    const minSize = NxN * SIZE / 2;
    for(const p of spec.parts) {
        for(let i = 0; i <= 1; i++) {
            let s = Math.abs(p.pos[i]) + parts[p.type].size[i];
            if(s > maxSize) {
                maxSize = s;
            }
        }
    }

    let scale = maxSize / minSize;
    let translation = [(canvas.width * scale - MARGIN) / 2 - minSize, (canvas.height * scale - MARGIN) / 2 - minSize];
    let rect = [0, 0, canvas.width, canvas.height];
    if(scale > 1) {
        rect = [-translation[0], -translation[1], scale * canvas.width, scale * canvas.height];
        ctx.scale(1/scale, 1/scale);
        ctx.translate(...translation);
    }

    ctx.clearRect(...rect);

    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(...rect);

    ctx.translate(MARGIN / 2, MARGIN / 2);
    //ctx.globalCompositeOperation = "multiply";
    for(let i = 0; i < NxN; i++) {
        for(let j = 0; j < NxN; j++) {
            let size = SIZE * .8;
            let offset = SIZE * .1;
            ctx.fillStyle = BOX_COLOR;
            let rect = [i * SIZE + offset, j * SIZE + offset, size, size]
            ctx.fillRect(...rect)
            //drawImage(ctx, "parts/sel1x1.png", i * SIZE + offset, j * SIZE + offset, size, size);
        }
    }
    ctx.fillStyle = BG_COLOR;

    ctx.globalCompositeOperation = "source-over";

    if(stats.shield > 0) {

        let r = stats.radius;
        if(scale > 1) { // big ship
            for(let part of spec.parts) {
                let d = Math.sqrt((part.pos[0] - stats.center[0])**2 + (part.pos[1] - stats.center[1])**2);
                if(d > r) r = d;
            }
        }

        r += 40;

        let x = NxN / 2 * SIZE + stats.center[0] - r;
        let y = NxN / 2 * SIZE - stats.center[1] - r;
        drawImage(ctx, "img/point02.png", x, y, r * 2, r * 2, 0, false, color, "color");
    }

    for(let part of spec.parts) {
        drawPart(ctx, part.type, part.pos[0], part.pos[1], part.dir, color);
    }

    //require("child_process").spawn("firefox", [canvas.toDataURL()]);
    //const image = new Image();
    //image.src = canvas.toDataURL();
    return canvas.toDataURL();
}

export function getImage(file:string, flip = false, color:Color, colorMode:ColorMode) {

    if(!mappings[file]) {
        //console.log("not in mappings", file);
        return null;
    }

    const uv = mappings[file].uv;
    const x = uv[0] * atlasSize;
    const y = (1 - uv[1]) * atlasSize;
    const x1 = uv[2] * atlasSize;
    const y1 = (1 - uv[3]) * atlasSize;
    const w = x1 - x;
    const h = y1 - y;

    let cCanvas = createCanvas(w, h);
    let cCtx = cCanvas.getContext('2d');

    if(flip)
        cCtx.setTransform(-1, 0, 0, 1, w, 0);

    cCtx.drawImage(atlas, x, y, w, h, 0, 0, w, h);

    if(color && colorMode) {
        let imageData = cCtx.getImageData(0, 0, w, h);
        let data = imageData.data;
        for(let i = 0; i < data.length; i += 4) {
            // I have no idea what these called so I made the name up
            if(colorMode === "color") {
                data[i] = data[i] * color[0] / 255;
                data[i+1] = data[i+1] * color[1] / 255;
                data[i+2] = data[i+2] * color[2] / 255;
                //data[i+3] = 255;
            } else if(colorMode === "replace") {
                if(data[i+1] === data[i+2] && data[i] > data[i+1]) {
                    let p = data[i] / (data[i] + data[i+1] + data[i+2]);
                    let c = (1-p) * data[i+1];
                    data[i] = p * color[0] + c;
                    data[i+1] = p * color[1] + c;
                    data[i+2] = p * color[2] + c;
                }
            }
        }
        cCtx.putImageData(imageData, 0, 0);
    }
    return cCanvas;
};

export function hasColor(name){
    return !!mappings["parts/red-" + parts[name].image];
};

export function isDecal(name){
    return name.includes("Decal") || name.includes("Letter") || name.includes("Stripe");
};

export function getStats(spec){
    let stats = {
        name:'',
        hp: 5,
        cost: 0,
        mass: 0,
        thrust: 0,
        turnSpeed: 1,
        genEnergy: 2.5,
        storeEnergy: 0,
        shield: 0,
        genShield: 0,
        jumpCount: 0,
        center: [0, 0],
        radius: 0,
        dps: 0,
        damage: 0,
        range: 0,
        moveEnergy: 0,
        fireEnergy: 0,
        otherEnergy: 0,
        allEnergy: 0,
        weapons: [],
        ais: []
    };

    let ix = 0;
    let iy = 0;
    let totalArea = 0;
    for(let p of spec.parts) {
        let data = parts[p.type];
        if(!data) continue;

        for(let j in stats) {
            if(data[j]) {
                stats[j] += data[j];
            }
        }

        if(p.type.startsWith("Engine"))
            stats.moveEnergy += data.useEnergy;
        else if(data.damage && !data.explodes) { // Is a weapon
            stats.weapons.push({
                type: p.type,
                name: parts[p.type].name,
                pos: p.pos,
                damage: data.damage,
                dps: 0,
                energyDamage: data.energyDamage,
                range: data.range,
                reloadTime: data.reloadTime,
                bulletSpeed: data.bulletSpeed,
                shotEnergy: data.shotEnergy,
                fireEnergy: 0,
                weaponRange: data.weaponRange,
                weaponRangeFlat: data.weaponRangeFlat,
                weaponDamage: data.weaponDamage,
                weaponSpeed: data.weaponSpeed,
                weaponReload: data.weaponReload,
                weaponEnergy: data.weaponEnergy
            });
        } else if(data.useEnergy) {
            stats.otherEnergy += data.useEnergy;
        }

        if(data.mass > 0 && !data.weapon) {
            let partArea = data.size[0] * data.size[1];
            ix += partArea * p.pos[0];
            iy += partArea * p.pos[1];
            totalArea += partArea;
        }
    }

    if(totalArea > 0) {
        stats.center = [ix / totalArea, iy / totalArea];
    }

    stats.radius = 0;
    for(let part of spec.parts) {
        let r = Math.sqrt((part.pos[0] - stats.center[0])**2 + (part.pos[1] - stats.center[1])**2);
        if(r > stats.radius && !isDecal(part.type)) {
            stats.radius = r;
        }
    }
    if(stats.radius > 500)
        stats.radius = 500;

    for(let p of spec.parts) {
        let data = parts[p.type];
        if(!data) continue;

        let ws = [];
        if(p.type.endsWith("Mod"))
            ws = stats.weapons.filter(w => Math.sqrt((p.pos[0] - w.pos[0])**2 + (p.pos[1] - w.pos[1])**2) < 45);
        else if(p.type.startsWith("Mount"))
            ws = stats.weapons.filter(w => Math.sqrt((p.pos[0] - w.pos[0])**2 + (p.pos[1] - w.pos[1])**2) < 20);

        let effect = (1/0.85) * (0.85 ** ws.length);
        for(let w of ws) {
            w.weaponRange *= 1 + (data.weaponRange || 0) / 100 * effect;
            w.weaponRangeFlat += (data.weaponRangeFlat || 0) * effect;
            w.weaponDamage *= 1 + (data.weaponDamage || 0) / 100 * effect;
            w.weaponSpeed += (data.weaponSpeed || 0) / 100 * effect;
            w.weaponReload *= 1 + (data.weaponReload || 0) / 100 * effect;
            w.weaponEnergy *= 1 + (data.weaponEnergy || 0) / 100 * effect;

            if(p.type.startsWith("Mount")) {
                w.mount = parts[p.type].name;
                w.arc = parts[p.type].arc;
            }
        }
    }

    stats.dps = 0;
    stats.damage = 0;
    stats.range = 0;
    stats.fireEnergy = 0;

    for(let w of stats.weapons) {

        w.range *= w.weaponRange;
        w.range += w.weaponRangeFlat;
        w.damage *= w.weaponDamage;
        w.energyDamage *= w.weaponDamage;
        w.bulletSpeed *= w.weaponSpeed;
        w.reloadTime *= w.weaponReload;
        w.shotEnergy *= w.weaponEnergy;

        w.reloadTime = Math.ceil(w.reloadTime) / 16
        w.bulletSpeed *= 16

        w.fireEnergy = w.shotEnergy / w.reloadTime
        w.dps = w.damage / w.reloadTime

        stats.dps += w.dps;
        stats.damage += w.damage;
        stats.range = Math.max(w.range, stats.range);
        stats.fireEnergy += w.fireEnergy;
    }

    stats.speed = (stats.thrust / stats.mass * 9 * 16);
    stats.jumpDistance = (Math.min(1, 41 * stats.jumpCount / stats.mass) * 600);
    stats.turnSpeed = stats.turnSpeed / stats.mass * 16 * 180 / Math.PI;
    stats.genEnergy *= 16;
    stats.genShield *= 16;
    stats.name = spec.name;
    stats.moveEnergy *= 16;
    stats.otherEnergy *= 16;
    stats.allEnergy = stats.fireEnergy + stats.moveEnergy;// + stats.otherEnergy;

    let buildRules = [
        "Field # at start",
        "Field # at priority #",
        "Try to field # every # seconds",
        "Field # for # of enemy @unitTypes at priority #",
        "Field # for # of ship in slot # at priority #",
        "Field # for # of @needTypes at priority #",
        "Field # when money over # at priority #",
    ];
    stats.ais = [];
    for(let ais of spec.aiRules) {
        if(!ais) continue;
        if(!buildRules.includes(ais[0])) {
            stats.ais.push(ais);
        }
    }
    for(let ais of spec.aiRules) {
        if(!ais) continue;
        if(buildRules.includes(ais[0])) {
            stats.ais.push(ais);
        }
    }

    return stats;
}