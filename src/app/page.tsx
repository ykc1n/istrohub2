
'use client'
import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import Ship from "./_components/ship";

import { Ships } from "./_components/ships";
export default function Home() {

  //const [ships,setShips] = useState([])

  const ships= api.ships.testGet.useQuery({
    count:10
  })


  return (

      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#9e9e9e] text-gray-500">
      <div className="bg-slate-100">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ml-4">
            Shipyard
          </h1>

          
      </div>
      
          
        <div className="flex justify-center">
          <button className="p-2 rounded-xl bg-slate-500 text-slate-50 transition-colors hover:text-slate-50 hover:bg-slate-400">
          Upload a ship  
          </button>
        </div>
        
        <Ships ships={ships.isSuccess ? ships.data : []}/>

          </main>
      );
}
