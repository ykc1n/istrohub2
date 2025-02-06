import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { doc,getDocs, limit, query, collection, where } from "firebase/firestore";
import { drawShip,getStats } from "~/app/shipey/shipey";
import { DummyShipArr } from "./shipArrData";
import { count } from "console";

declare global {
    interface ShipData {
    name:string,
    shipey:string
}
}


export  const shiprouter = createTRPCRouter({
    test: publicProcedure.
    input(z.object({ name: z.string() })).
    query( async ({input}) => {
        let shipsref = collection(db, "ships")
        let q =  query(shipsref,limit(10),where('name',"==",input.name))
        let docRef = doc(db, "ships","test")
        let docSnap = await getDocs(q)
        if (!docSnap.empty){
        
            return {data: docSnap.docs[0].data()}
        }
    
        

        return {data:"no ship found"}
    }),
    getimg: publicProcedure.
    input(z.object({shipey: z.string()})).
    query(
        ({input})=>{
        const inp:string = input.shipey.slice(4)
        console.log("helo")
        console.log(atob(inp))

        const spec:object = JSON.parse(atob(inp))
        let stats = getStats(spec)   
        let img = drawShip(spec,stats)
        //console.log(img)
            return {data: img.src}
        }
    ),

    testGet: publicProcedure.
    input(z.object({
        count: z.number()
    })).
    query( ({input})=>{
        if(DummyShipArr.length < input.count){
            return DummyShipArr
        }

        return DummyShipArr.slice(0,input.count)
    })

})