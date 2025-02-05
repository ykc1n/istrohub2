'use client'

//import { useEffect } from "react"
import { api } from "~/trpc/react"
import { ShipCopyButton } from "./shipbutton"
import Image from "next/image"
import { useState } from "react";


export default  function Ship(){
    //const test = await api.ships.test({name:"Cascade"})
    const data = {
        name: "test",
        shipey: "shipeyJwYXJ0cyI6W3sicG9zIjpbMCwwXSwidHlwZSI6Ik1vdW50MzAiLCJkaXIiOjB9LHsicG9zIjpbLTEwLC00MF0sInR5cGUiOiJFbmdpbmUwNCIsImRpciI6MH0seyJwb3MiOlsxMCwtMzBdLCJ0eXBlIjoiQmF0dGVyeTF4MSIsImRpciI6MH0seyJwb3MiOlsxMCwtNTBdLCJ0eXBlIjoiV2luZzF4MU5vdGNoIiwiZGlyIjowfSx7InBvcyI6WzAsMF0sInR5cGUiOiJUb3JwVHVycmV0IiwiZGlyIjowfV0sIm5hbWUiOiIiLCJhaVJ1bGVzIjpbXX0="
    }

    
    const [img,setImg] = useState("loading.svg")
    const  testImg =  api.ships.getimg.useQuery({ shipey: data.shipey });
    console.log(testImg.status)
   if (testImg.isSuccess){
    console.log("W!")
        console.log(testImg.data)
   }
    return (
        <div className="p-5 border-slate-400 border-2 rounded-lg mx-4 my-1 w-1/6">
            <div className="overflow-auto">
            <h2 className=" text-4xl font-bold text-center"> {data.name} </h2>
            </div>


             <Image
             src={testImg.isSuccess ? testImg.data.data : "loading.svg"}
             width={500}
             height={500}
             alt="not yet"
             />
            
        <div className="flex justify-center p-2">
            <ShipCopyButton shipey={data.shipey} /> 
        </div>

                       

            

        </div>
    )
}