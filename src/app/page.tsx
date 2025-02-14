
'use client'
import Link from "next/link";
import Image from "next/image";
import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import Ship from "./_components/ship";
import { useState } from "react";

import { Ships } from "./_components/shipLoader";

function EnergyBars(){
  return      <div className="mx-8  grid items-end justify-items-center "> 
  
      
        

      <div className="p-3  bg-cyan-200  rounded h-[50%] row-start-1 col-start-1 ">
        
        </div> 

      <div className="p-2  bg-black bg-slate-300 rounded-full h-[99%] row-start-1 col-start-1 ">
        
      </div>
     
     <div className="p-2  bg-green-500  rounded-full h-[50%] row-start-1 col-start-1 ">
        
        </div> 
    

      </div> 
}

function Filter(props:{
  availableFilters: string[],
  apply: (filterName:FilterName ,filterOptions:FilterOptions) => void
}){

  const [selectedFilter,changeSelectedFilter] = useState('hp') as [FilterName, (filterCondition: FilterName)=>void ]
 // const [filterApplied, applyFilter] = useState(false)
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
      <option value={"<"}> Is less than </option>
      <option value={">"}> Is greater than </option>
      
    </select>

    <input id="filterValue" name={selectedFilter} className=" rounded-lg text-black text-xl font-semibold text-center bg-black bg-opacity-10 px-2 mx-2 transition-colors duration-300 hover:bg-opacity-20"
    onChange={(e)=> {
      setValue(e.target.value);
    }}
    >
    
    </input>
    <input type="button" className={ "rounded-lg  font-semibold text-center bg-black bg-opacity-10 px-4 py-1 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white" }
    onClick={ (e)=>{
        e.preventDefault()
       props.apply(selectedFilter,{
        condition: condition,
        value: value
       })
       
    }
    }
     value= 
      {"Apply" }
      />
    
    </div>

    </div>

  )
}

function AppliedFilter(props:{
  filter:{
    name: FilterName,
    filterOpts: FilterOptions
  }
  remove: (name:FilterName)=> void
}){
  return(
    <div className=" bg-black bg-opacity-10 rounded-full py-1 px-2 text-sm mx-1 my-auto transition-colors duration-300 hover:bg-opacity-20">
       <button className="m-1 rounded-full border border-gray-500 transition-colors duration-300 hover:bg-black hover:text-white px-2 hover:border-black"
       onClick={(e)=>{
        e.preventDefault()
        props.remove(props.filter.name)
       }}
       >
        X
      </button>
      
      {
        `where: ${props.filter.name} ${props.filter.filterOpts.condition} ${props.filter.filterOpts.value}` 
      }

     
      </div>
  )
}

function DetailedShip(props:{
  img:string,
  stats:object,
  weapons:object,
  name:string
}){

  const titleMap = new Map([
    ['hp',['HP','hp']],
    ['cost',['Cost','$']],
   ['mass',['Mass','T']], 
   ['thrust',['Thrust','kN']], 
    ['turnSpeed',['Turn Rate','°']],
    ['genEnergy',['Energy Gen', 'E/s']],
    ['storeEnergy',['Energy Capacity', 'E']],
    ['shield',['Shield','sh']],
    ['genShield',['Shield Gen','sh/s']],
    ['moveEnergy',['Movement Energy','E']],
    ['fireEnergy',['Firing Energy','E']],
    ['allEnergy',['Total Energy Usage','E/s']],
    ['damage',['Burst Damage','Burst']],
    ['range',['Max Range', 'm']],
    ['dps',['DPS','dps']],
    ['radius',['Size','m']],
    ])

  const renderedStats = []
  //console.log(props.stats.mass)
  for(const stat in props.stats){
    let curStat = props.stats[stat]

    if(!titleMap.has(stat)){
      continue
    }


    if(!Number.isInteger(curStat) && (typeof curStat) != 'string' ){
      console.log(curStat)  
      curStat =  curStat.toFixed(2)
      }
    
    const newStats = (<div
    key={stat+curStat}
    className="py-1 text-lg font-bold p-2 bg-black bg-opacity-5 m-1 rounded-lg transition-colors duration-300 hover:bg-opacity-10"
    >
      <p className="text-lg text-nowrap text-center m-1 overflow-auto">{titleMap.get(stat)[0]}</p>
     <p className="font-normal text-center"> {
     
    curStat  
     
     } </p>

    </div>)
    renderedStats.push(newStats)
  }
  return (
    <div className="p-4 bg-black bg-opacity-5 rounded-lg flex max-h-[40em] max-w-[60em]">
    <div>

      <button className="rounded-full text-black text-lg font-semibold text-center bg-black bg-opacity-10 px-2 transition-colors duration-300 hover:bg-opacity-75 hover:bg-red-600 hover:text-white">
        X
      </button>

    </div>
    <div className="flex">

    
    <div>

    <div className="text-5xl font-bold text-center">{props.name}</div>

    <Image
    src={props.img}
    width={500}
    height={500}
    alt="none"
    
    />
    <div className='flex justify-center'>

   
    <button className={paginationSection}>
      Copy ship
    </button>
 </div>

    
    </div>

    <div className="overflow-auto">
      <button className={paginationSection}>
        Stats
      </button>
      <div className="grid grid-rows-4 grid-cols-3 " >

      
      {
        renderedStats
      }
    </div>
    </div>
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
  const [filters,setFilter] =  useState(new Map<FilterName, FilterOptions>())
  const [selectedShip, setSelectedShip] = useState({
    id: -1,
    img: "loading.svg",
    name: "none",
    stats: {
    }
  })
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



function renderSelectedShip(){
  if (selectedShip.id < 0){
    return <></>
  }
  //console.log(selectedShip.stats.weapons)
  let shipweapons = selectedShip.stats.weapons;
  let fixedStats = selectedShip.stats
  delete fixedStats.weapons
  delete fixedStats.ais
  delete fixedStats.center
  return( <DetailedShip
  img={selectedShip.img}
  stats = {fixedStats}
  name={selectedShip.name}
  weapons = {selectedShip.stats.weapons}
  /> )
}

function applyFilter(name:FilterName,opts:FilterOptions){
  setFilter(filters => {filters.set(name, opts)
    return new Map(filters);
  });
  console.log(filters);
}

function removeFilter(name:FilterName){
  setFilter(filters => {filters.delete(name)
    return new Map(filters);
  })
}

 
const renderedFilters:JSX.Element[] = []; 
function renderFilters(){
      if(filters.size >0 ){
            for( const filt of filters){

             const renderedFilter = <AppliedFilter
                filter={
                  {
                  name:filt[0],
                  filterOpts:filt[1]
                }
              }
              remove={removeFilter}
              key={filt[0]+filt[1].condition+filt[1].value}
                /> 
              console.log()
              renderedFilters.push(renderedFilter);
            }
          }
            return renderedFilters; 
}

  return (

      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#9e9e9e] text-gray-500">
      <div className="bg-slate-100 flex justify-between">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ml-4">
            Shipyard
          </h1>

            
          <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-1 my-4 mx-[10%] transition-colors duration-300 hover:bg-opacity-75 hover:text-white">
          Upload a ship  
          </button>
      </div>
       <div className="flex my-2">

       
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

          <div className="">
          {/* <input name='name' className="mt-4 rounded-lg text-black text-2xl font-semibold bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-20">
          </input> */}

          

          


          <button className="mt-2 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-2 mx-2 transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
          type="submit"
          onSubmit={e => e.preventDefault()}
          >
            Search!
          </button> 

          <div className="flex flex- flex-wrap mt-4">



          {
            
         renderFilters() 
        }

          
          </div>
          </div>



          <div className="py-4 ">
{/* 
            <button className={paginationSection}>
              New Filter
            </button> */}

            {Filter({availableFilters: availableFilters, apply: applyFilter})}


          </div>

          </form>


        </div>
          <div className="flex justify-center">
{/*
            <DetailedShip
            img="loading.svg"
            name="samson"
            stats={{
              hp:100,
              mass:100,
              speed:100
            }}
            />
*/
renderSelectedShip()
}

          </div>
        { (shipQuery.isSuccess && shipQuery.data != null) && !shipQuery.isFetching ? 
          // Ships({ships:shipQuery.data})
                  ( <div className="mx-auto flex justify-center flex-wrap px-4 py-16">
          
                  {
                    
                    shipQuery.data.map( (ship) => {
                      //i+=1
                      return (
                      <Ship
                      key = {ship.id}
                      
                      id={ship.id}
                      name = {ship.name}
                      parts= {ship.parts}
                      selected = {ship.id === selectedShip.id}
                      clickFunction= {setSelectedShip}
                      
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
