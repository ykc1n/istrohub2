'use client'

import { api } from "~/trpc/react"

import Image from "next/image"
import { useEffect, useMemo, useState } from "react";
import { drawShip, getStats} from "../shipey/shipey";

function ShipCopyButton( props: {shipey:string;}){
    function copyText(text:string){
          void navigator.clipboard.writeText(text)
          alert("shipey copied")
  }

  // useEffect(()=>{
  //     document.getElementById("copybutton").addEventListener("onclick",(e) =>{ copyText(data.shipey)})
  // })


  return (
      <button
      
      onClick={(e)=>{
          copyText(props.shipey)
      }}
      className="rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
      >
          Copy ship
      </button>
  )

}


export default  function Ship(props:{
    parts:string,
    name:string,
    id:number,
    clickFunction: (id:number, name:string, stats:object)=>void,
    selected:boolean
}   ){


    
    const [img,setImg] = useState("loading.svg")
    const [spec,setSpec] = useState(props.parts);
    

    const i = useMemo( async ()=>{
        const stats = getStats(spec)
        const i = await drawShip(spec, stats)
        setImg(i);
        return i
    }, [spec])

    return (
        <div className={`p-5 bg-black ${ props.selected? 'bg-opacity-15' : 'bg-opacity-5'} rounded-lg m-4 w-1/6`}> 
            <div className="overflow-auto">
            <h2 className=" text-4xl font-bold text-center"> {props.name} </h2>
            </div>


             <Image
             src={ img}
             width={500}
             height={500}
             alt="not yet"

             className=" transition-all duration-300 scale-100 hover:scale-105"
             onClick={ (e) => {
                console.log("clicked..")
                props.clickFunction( (selectedShips) => {
                    let newMap = new Map(selectedShips)
                    newMap.set(props.id,
                    {id: props.id, 
                    name: props.name, 
                    img: img,
                    stats: getStats(spec),
                    statsToCompare: {}
                    })
                    return newMap
                })
             }
            }
             />
            
        <div className="flex justify-center p-2">
            <ShipCopyButton shipey={btoa(props.parts)} /> 
            
            {/* <ShipCopyButton shipey={JSON.stringify(stats)} /> */}
        </div>

                       

            

        </div>
    )
}