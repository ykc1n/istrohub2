'use client'

//import { useEffect } from "react"
import { api } from "~/trpc/react"
import { ShipCopyButton } from "./shipbutton"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react";
import { drawShip, getStats} from "../shipey/shipey";

export default  function Ship(data:ShipData){
    //const test = await api.ships.test({name:"Cascade"})
    // const data = {
    //     name: "test",
    //     shipey: "shipeyJwYXJ0cyI6W3sicG9zIjpbMCwwXSwidHlwZSI6Ik1vdW50MzAiLCJkaXIiOjB9LHsicG9zIjpbLTEwLC00MF0sInR5cGUiOiJFbmdpbmUwNCIsImRpciI6MH0seyJwb3MiOlsxMCwtMzBdLCJ0eXBlIjoiQmF0dGVyeTF4MSIsImRpciI6MH0seyJwb3MiOlsxMCwtNTBdLCJ0eXBlIjoiV2luZzF4MU5vdGNoIiwiZGlyIjowfSx7InBvcyI6WzAsMF0sInR5cGUiOiJUb3JwVHVycmV0IiwiZGlyIjowfV0sIm5hbWUiOiIiLCJhaVJ1bGVzIjpbXX0="
    // }

    
    const [img,setImg] = useState("loading.svg")
    const [spec,setSpec] = useState(JSON.parse(atob(data.shipey.slice(4))));
    

    //const  testImg = drawShip(spec,stats)
    // 
    // if (spec!= newSpec){
    //     setSpec(newSpec)
    // }
    const i = useMemo( async ()=>{
        const stats = getStats(spec)
        const i = await drawShip(spec, stats)
        setImg(i);
        return i
    }, [spec])
    
    // useEffect( 
    //      ()=>{

           

    //         const abortController = new AbortController();
    //         const getShipImg = async () =>{
    //             try{

                    
                       
    //         const spec = JSON.parse(atob(data.shipey.slice(4)))
    //         console.log("wtf")
    //         const stats = getStats(spec)
    //         const i = await drawShip(spec,stats)
    //         setImg(i)
            
                    
    //     } catch (e){
    //         console.log("error!")
    //     }
    //     }

    //     void getShipImg()
    //     return ()=>{
    //         abortController.abort()
    //     }
    // }
    // )

//api.ships.getimg.useQuery({ shipey: data.shipey });
//     console.log(testImg.status)
//    if (testImg.isSuccess){
//     console.log("W!")
//         console.log(testImg.data)
//    }
    return (
        <div className="p-5 bg-black bg-opacity-5 rounded-lg m-4 w-1/6">
            <div className="overflow-auto">
            <h2 className=" text-4xl font-bold text-center"> {data.name} </h2>
            </div>


             <Image
             src={ img}
             width={500}
             height={500}
             alt="not yet"
             />
            
        <div className="flex justify-center p-2">
            <ShipCopyButton shipey={data.shipey} /> 
            {/* <ShipCopyButton shipey={JSON.stringify(stats)} /> */}
        </div>

                       

            

        </div>
    )
}