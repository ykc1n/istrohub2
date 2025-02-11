'use client'
import { api } from "~/trpc/react";

import { z } from "zod";
import { getStats } from "../shipey/shipey";
const paginationSection = "rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
export default function Page(){

  const shipQuery= api.ships.getShips.useQuery({
    count:1000,
    page: 0
  })

    const shipDataSchema  = z.object({
      id: z.number(),
      name: z.string().min(1),
      shipey: z.string().min(1),
  })

  const shipMigration = api.ships.migrate.useMutation();

  function changeData(){
    if (!shipQuery.data){
        return; 
    }
    const changedShips = shipQuery.data.flatMap( ship => {
        const shipData = shipDataSchema.safeParse(ship)
        if (!shipData.success) return [];

        const shipjson = atob(shipData.data.shipey.slice(4))
        console.log(shipjson);
        const stats = getStats(JSON.parse(shipjson))

        return {
            id: ship.id,
            shipeyJSON: shipjson,
            stats: JSON.stringify(stats)
        }
        
        
    })

    console.log(changedShips);



  shipMigration.mutate({oldShips:changedShips});
  }

return (

      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#9e9e9e] text-gray-500">
      <div className="bg-slate-100">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ml-4">
            Shipyard
          </h1>

          
      </div>
      
          
        <div className="flex justify-center">
           <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white">
        { shipQuery.isPending ? "Loading ships..." : "Got all ships!"}
          </button> 

          <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
          onClick={
            changeData
          }
          >
         Change their data
          </button>
        </div>

        <div className="mt-4 p-2 rounded white flex justify-center mx-auto  py-12">
        
         <div className="px-9">
</div>


        </div>
        


          </main>
      );
    }
