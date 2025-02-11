
'use client'
import Link from "next/link";
import Image from "next/image";
import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import Ship from "./_components/ship";
import { useState } from "react";

import { Ships } from "./_components/ships";

function PaginationButton( props:
  {callback:  () => void,
  contents:string
  }){
    <button
    className=""
    onClick={
      props.callback
    }
    >
      {props.contents}
    </button>

}


const paginationSection = "rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"

export default function Home() {



  const [page,setPage] = useState(0)
  const filters =  new Map<string, string>()
  const utils = api.useUtils()
  // const [queryState, setQueryState] = useState(true)

  const shipQuery= api.ships.getShips.useQuery({
    count:10,
    page: page,
    filters: filters
  })





 



  return (

      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#9e9e9e] text-gray-500">
      <div className="bg-slate-100">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ml-4">
            Shipyard
          </h1>

          
      </div>
       <div className="flex justify-center my-4">

         
          <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white">
          Upload a ship  
          </button>
          </div>
          
        <div className="flex justify-center">
          <form action={
            async (e) =>{
              const value = e.get('name')
              if(typeof value != 'string' || value == ""){
                filters.delete('name');
                await utils.invalidate();
                return;
              }
              filters.set('name', value);

              await utils.invalidate();
            }
          }>

          
          <input name='name' className="mt-4 rounded-lg text-black text-2xl font-semibold bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-20">
          </input>
          <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
          type="submit"
          onSubmit={e => e.preventDefault()}
          >
           
            Search!
          </button> 
          </form>
        </div>
        { (shipQuery.isSuccess && shipQuery.data != null) && !shipQuery.isFetching ? 
          Ships({ships:shipQuery.data})
          
         : (
        <Image
        className=" mx-auto"
        src = "loading.svg"
        width={500}
        height={500}
        alt="Loading ships..."
        /> )
        }

        <div className="mt-4 p-2 rounded white flex justify-center mx-auto  py-12">
        
         <div className="px-9">
        <button className={paginationSection}
        onClick={          
          function(){
            if(page > 0){
            setPage( 0)
            }
          }
          }
        >
          {"First Page"}
          
        </button>

        <button className={paginationSection}
                onClick={          
                  function(){
                    if(page > 0){
                    setPage(  page  => page - 1)
                    }
                  }
                  }
        >
          {"Previous Page"}
        </button>
        </div>

        <div className= {paginationSection}>
          {page}
        </div>

        <div className="px-9">

        
         <button className={paginationSection}
         onClick={          
          function(){
            
            setPage(  page  => page + 1)
            
          }
          }>
          {"Next Page"}
        </button> 
</div>


        </div>
        


          </main>
      );
}
