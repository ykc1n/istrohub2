'use client'


import Image from "next/image"
import {  useMemo, useState } from "react";
import { drawShip, getStats, hexToRgb} from "../shipey/shipey";

export function ShipCopyButton( props: {shipey:string;}){

    const [isCopied, setIsCopied] = useState("Copy Ship")

    function copyText(text:string){
            //console.log(text);
          void navigator.clipboard.writeText(text)
          setIsCopied("Copied!")
  }

  // useEffect(()=>{
  //     document.getElementById("copybutton").addEventListener("onclick",(e) =>{ copyText(data.shipey)})
  // })


  return (
  <>
    <div className="">
    </div>
      <button
      
      onClick={(e)=>{
          copyText(props.shipey)
      }}
      className="rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
      >
          {isCopied}
      </button>
    </>
  )

}


export default  function Ship(props:{
    parts:string,
    name:string,
    id:number,
    clickFunction: (param:(selectedShips:Map<number, object>)=>Map<number,object>)=>void,
    selected:boolean,
    color:string
}   ){


    
    const [img,setImg] = useState("loading.svg")
    const [spec] = useState(props.parts);
    const [title, setTitle] = useState('')



    const i = useMemo( async ()=>{
        const stats = getStats(spec)
         setTitle(stats.name)
         //console.log(props.color)
         //console.log(hexToRgb(props.color))
        const i = await drawShip(spec, stats, hexToRgb(props.color))
        setImg(i);
        return i
    }, [spec])

    return (
        <div className={`p-5 bg-black ${ props.selected? 'bg-opacity-15' : 'bg-opacity-5'} aspect-3/3 min-w-1/4 rounded-lg m-4 `}> 
            <div className="overflow-auto">
            <h2 className=" text-[clamp(0.9rem, 0.257rem + 2.143vw, 2.25rem)] font-bold text-center"
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
             className=" w-[90%] transition-all duration-300 scale-100 hover:scale-105"
             onClick={ (e) => {
                //console.log("clicked..")
                props.clickFunction( (selectedShips) => {
                    const newMap = new Map(selectedShips)
                    newMap.set(props.id,
                    {id: props.id, 
                    name: props.name, 
                    img: img,
                    stats: getStats(spec),
                    parts: props.parts,
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