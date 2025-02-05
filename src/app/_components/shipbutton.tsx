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
        className="rounded-lg font-semibold text-center bg-slate-50 p-2 transition-colors duration-300 hover:bg-slate-500 hover:text-white"
        >
            Copy shipey
        </button>
    )

}

