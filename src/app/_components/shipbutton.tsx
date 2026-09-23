'use client'

import { useEffect } from "react"

export function ShipCopyButton( props: {shipey:string;}){
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

