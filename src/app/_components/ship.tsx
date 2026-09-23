'use client'


import { shipSpecSchema, type SelectedShip } from '../shipey/types';
import Image from "next/image"
import {  useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { drawShip, getStats, hexToRgb} from "../shipey/shipey";

export function ShipCopyButton( props: {shipey:string;}){

    const [isCopied, setIsCopied] = useState("Copy Ship")

    function copyText(text:string){
            //console.log(text);
          void navigator.clipboard.writeText(text)
          setIsCopied("Copied!")
  }



  return (
  <>
    <div className="">
    </div>
      <button
      
      onClick={(e)=>{
          copyText(props.shipey)
      }}
      className="rounded-lg dark:text-neutral-400 text-black text-2xl font-semibold text-center bg-black dark:bg-opacity-50 bg-opacity-15 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-100 hover:text-white"
      >
          {isCopied}
      </button>
    </>
  )

}


export default  function Ship(props:{
    parts:unknown,
    name:string,
    id:number,
    clickFunction: Dispatch<SetStateAction<Map<number, SelectedShip>>>,
    selected:boolean,
    color:string
}   ){


    
    const [img,setImg] = useState("loading.svg")
    const [spec] = useState(() => shipSpecSchema.parse(props.parts));
    const [title, setTitle] = useState('')



    useEffect(() => {
        let cancelled = false;
        const stats = getStats(spec);
        setTitle(stats.name);
        void drawShip(spec, stats, hexToRgb(props.color)).then(image => {
            if (!cancelled) setImg(image);
        }).catch(() => {
            if (!cancelled) setImg("loading.svg");
        });
        return () => { cancelled = true; };
    }, [spec, props.color]);

    return (
        <div className={`p-5 bg-black dark:bg-opacity-30 bg-opacity-10 aspect-3/3 min-w-1/4 rounded-lg m-4 `}> 
            <div className="overflow-auto">
            <h2 className=" text-[clamp(0.9rem, 0.257rem + 2.143vw, 2.25rem)] dark:text-neutral-200 font-bold text-center"
            style={{
                fontSize:"clamp(0.9rem, 0.257rem + 2.143vw, 2.5rem)"
            }}
            > {props.name} 
        
            </h2>
            <h1 className=" text-center italic "> {title} </h1>
            
            </div>
        <div className="flex justify-center">
             <Image
             src={ img}
             width= {250}
             height={250}

            
             alt="not yet"
             className={`transition-all duration-300 scale-100 hover:scale-105 ${img=='loading.svg'? 'min-w-[520px] max-w-[90%] h-[520px]' : 'w-[90%]'}`}
             onClick={ (e) => {
                //console.log("clicked..")
                props.clickFunction( (selectedShips) => {
                    const newMap = new Map(selectedShips)
                    newMap.set(props.id,
                    {id: props.id, 
                    name: props.name, 
                    img: img,
                    stats: getStats(spec),
                    parts: spec,
                    statsToCompare: {},
                    color: props.color
                    })
                    return newMap
                })
             }
            }
             />
            </div>
        <div className="flex justify-center p-2">
            <ShipCopyButton shipey={('ship'+btoa(JSON.stringify(props.parts)))} /> 
            
            {/* <ShipCopyButton shipey={JSON.stringify(stats)} /> */}
        </div>
        <h1 className="text-center italic">#{props.color}</h1>

                       

            

        </div>
    )
}