
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

function Filter(props:{
  availableFilters: string[],
  apply: (filterName:FilterName ,filterOptions:FilterOptions) => void
}){

  const [selectedFilter,changeSelectedFilter] = useState('hp') as [FilterName, (filterCondition: FilterName)=>void ]
  const [filterApplied, applyFilter] = useState(false)
  const [condition,setCondtion] = useState('=') as [FilterCondition, (filterCondition: FilterCondition)=>void ]
  const [value, setValue] = useState('')
  return (

    <div className="flex justify-center gap-3 py-2">
      <div>
      {/* <p>Filter: </p> */}
      <select className="mr-2 p-1 rounded bg-black bg-opacity-10 [&:not(option)]:transition-colors duration-300 hover:bg-opacity-20"
     onChange={(e)=>{
            const value = e.target.value as FilterName
           changeSelectedFilter(value);
          }} 
      >
      {
      props.availableFilters.map( (filter) => {
        return (
          <option key={filter} value={filter}
          
          >
            {filter}
          </option>
        )
      })
    }
    </select>
    </div>
    <div>
    {/* <p>Where: {selectedFilter}</p> */}
    <select className="mr-2 p-1 rounded bg-black bg-opacity-10 [&:not(option)]:transition-colors duration-300 hover:bg-opacity-20"
    onChange={(e)=>{
      
      setCondtion(e.target.value as FilterCondition)}}
    >
      <option value={"="}> Is equal to </option>
      <option value={">"}> Is less than </option>
      <option value={"<"}> Is greater than </option>
      
    </select>

    <input id="filterValue" name={selectedFilter} className=" rounded-lg text-black text-xl font-semibold text-center bg-black bg-opacity-10 px-2 mx-2 transition-colors duration-300 hover:bg-opacity-20"
    onChange={(e)=> {
      setValue(e.target.value);
    }}
    >
    
    </input>
    <input type="button" className={!filterApplied ? "rounded-lg  font-semibold text-center bg-black bg-opacity-10 px-4 py-1 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white" :  "rounded-lg  font-semibold text-center bg-black px-4 py-1 mx-2 transition-colors duration-300 bg-opacity-75 text-white"}
    onClick={ (e)=>{
        e.preventDefault()
       applyFilter(true)
       props.apply(selectedFilter,{
        condition: condition,
        value: value
       })
       
    }
    }
     value= 
      {!filterApplied ? "Apply" : "Applied" }
      />
    
 
    <button className="rounded-lg  font-semibold text-center bg-black bg-opacity-10 px-4 py-1 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white" >
      Remove Filter
    </button>
    </div>

    </div>

  )
}


const paginationSection = "rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"

type NumFilterName =  "hp" | "mass" |"speed"
type StrFilterName = "name"
type FilterName = NumFilterName | StrFilterName

type FilterEquals = "="
type FilterLessThan = "<"
type FilterGreaterThan = '>'
type FilterCondition = FilterEquals | FilterLessThan | FilterGreaterThan
type FilterOptions = {
  condition: FilterCondition,
  value: string
}



export default function Home() {



  const [page,setPage] = useState(0)
  const filters =  new Map<FilterName, FilterOptions>()
  const utils = api.useUtils()
  // const [queryState, setQueryState] = useState(true)

  const shipQuery= api.ships.getShips.useQuery({
    count:10,
    page: page,
    filters: filters
  }
  // ,{
  //   enabled:false
  // }

)

const availableFilters = ["hp", "mass", "speed"]


function applyFilter(name:FilterName,opts:FilterOptions){
  filters.set(name, opts);
  console.log(filters);
}

 
let i = 0


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
              filters.set('name', { condition:"=", value:value});

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

          <div className="py-4 ">

            <button className={paginationSection}>
              Add Filter
            </button>

            {Filter({availableFilters: availableFilters, apply: applyFilter})}


          </div>

          </form>
        </div>
        { (shipQuery.isSuccess && shipQuery.data != null) && !shipQuery.isFetching ? 
          // Ships({ships:shipQuery.data})
                  ( <div className="mx-auto flex justify-center flex-wrap px-4 py-16">
          
                  {
                    
                    shipQuery.data.map( (ship:ShipData) => {
                      i+=1
                      return (
                      <Ship
                      key = {i}
                      name = {ship.name}
                      shipey= {ship.shipey}
                      /> 
                      )
                    })
                  
                  }
          
                              
                    </div>)
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
