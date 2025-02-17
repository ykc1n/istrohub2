
'use client'
import Link from "next/link";
import Image from "next/image";
import { LatestPost } from "~/app/_components/post";
import { api } from "~/trpc/react";
import Ship from "./_components/ship";
import { useState } from "react";

import { Ships } from "./_components/shipLoader";
import { title } from "process";
import Upload from "./_components/upload";
import { ShipCopyButton } from "./_components/ship";

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
  availableFilters: Map<string, [string,string[]]>,
  apply: (filterName:FilterName ,filterOptions:FilterOptions) => void
}){

  const [selectedFilter,changeSelectedFilter] = useState('hp') as [FilterName, (filterCondition: FilterName)=>void ]
 // const [filterApplied, applyFilter] = useState(false)
  const [condition,setCondtion] = useState('=') as [FilterCondition, (filterCondition: FilterCondition)=>void ]
  const [value, setValue] = useState('')
  const operatorMap = new Map<string, string>([
    ['=', 'is equal to'],
    ['<', 'is less than'],
    ['>', 'is greater than']
  ])
  const filterTargets = []
  function renderFilterTargets(){
    for(const filter of props.availableFilters){
      filterTargets.push(
        <option key={filter[0]} value={filter[0]}>
          {filter[1][0]}
        </option>
      )
    }
  }
  renderFilterTargets()
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
        filterTargets
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
  name:string,
  id:number,
  clickFunction:(param:(map:Map<number,object>)=>object)=>void,
  compareFunction:(param:(arr:[])=>[])=>void,
  statsToCompare:object,
  //isBeingCompared:boolean
  parts:object, 
  color:string
}){

  const [isBeingCompared, setBeingCompared] = useState(false);

  



  const titleMap = new Map([
    ['hp',['HP','hp',true]],
    ['cost',['Cost','$',false]],
    ['mass',['Mass','T',false]],
    ['speed',['Speed', 'm/s',true]],
    ['thrust',['Thrust','kN',true]], 
    ['turnSpeed',['Turn Rate','°',true]],
    ['genEnergy',['Energy Gen', 'E/s',true]],
    ['storeEnergy',['Energy Capacity', 'E',true]],
    ['shield',['Shield','sh',true]],
    ['genShield',['Shield Gen','sh/s',true]],
    ['moveEnergy',['Movement Energy','E/s',false]],
    ['fireEnergy',['Firing Energy','E',false]],
    ['allEnergy',['E use','E/s',false]],
    ['damage',['Burst Damage','Burst',true]],
    ['range',['Max Range', 'm',true]],
    ['dps',['DPS','dps',true]],
    ['radius',['Size','m',false]],
    ])

  const renderedStats = []
  //console.log(props.stats.mass)
  for(const stat in props.stats){
    let curStat = props.stats[stat]
    let statColor = "bg-black bg-opacity-5 "
    let hoverColor = 'hover:bg-opacity-10'
    if(!titleMap.has(stat) || curStat == 0){
      continue
    }
    if(isBeingCompared){
    const compStat =  props.statsToCompare[stat]
    
    if(compStat){
    console.log(compStat)
    }


    if( titleMap.get(stat)[2] ^ (curStat > compStat)){
      statColor = "bg-green-500 bg-opacity-15"
      hoverColor = 'hover:bg-opacity-25'
    } else if( curStat == compStat){
      statColor = 'bg-black bg-opacity-5'
      hoverColor = 'hover:bg-opacity-10'
    } else {
      statColor = "bg-red-300 bg-opacity-50"
      hoverColor = 'hover:bg-opacity-80'
    }
  }


    if(!Number.isInteger(curStat) && (typeof curStat) != 'string' ){
      //console.log(curStat)  
      curStat =  curStat.toFixed(2)
      }
    
    const newStats = (<div
    key={stat+curStat}
    className={`text-base font-bold p-1 ${statColor} basis-0 flex-grow m-1 rounded-lg transition-colors duration-300 ${hoverColor}`}
    >
      <p className="text-xs md:text-base  text-nowrap text-center m-1 overflow-auto">{titleMap.get(stat)[0]}</p>
     <p className="font-normal text-center"> {
     
    curStat  +' '+titleMap.get(stat)[1]
     
     } </p>

    </div>)
    renderedStats.push(newStats)
  }
  if(isBeingCompared == false && Object.keys(props.statsToCompare).length > 0 ){
    setBeingCompared(true);
  }
  return (
    

    
    <div className="p-4 bg-black bg-opacity-5 rounded-lg flex  transition-transform transition-discrete max-w-[47%] overflow-auto">
    <div>

      <button className="rounded-full text-black text-lg font-semibold text-center bg-black bg-opacity-10 px-2 transition-colors duration-300 hover:bg-opacity-75 hover:bg-red-600 hover:text-white"
      onClick={(e) =>{props.clickFunction(
        (map)=>{
        console.log("hmmmm")
        const newMap = new Map(map)
        console.log(newMap)
        newMap.delete(props.id)
        console.log(newMap)
        console.log(props.id)
        return newMap
      })
    }
  }
      >
        X
      </button>

    </div>
    <div className="flex justify-center w-[100%]">
    <div className=" ">

    
    <div className="min-w-[50%] ">

    <div className="text-5xl font-bold text-center">{props.name}</div>
    <div className="italic text-center"> {props.stats.name}</div>
    <div className="italic"> #{props.color}</div>
    <div className="flex justify-center">

   
    <Image
    src={props.img}
    width={500}
    height={500}
    alt="none"
    className="min-w-30%"
    /> </div>
    <div className='flex justify-center'>

   
<ShipCopyButton
shipey={('ship'+btoa(JSON.stringify(props.parts)))}

/> 

<button   className={paginationSection}      onClick={(e)=>{props.compareFunction(
          (arr)=>{
            //console.log(arr)
            //console.log("id pushed!")
            const newArr = [...arr, props.id]
            //newArr.push(props.id)
            return newArr
          })
        }} >
  Compare
</button>
 </div>

    
    </div>

    
      {/* <button className={paginationSection}>
        Stats
      </button> */}
      <div className=" py-3 grid flex-wrap grid-cols-2 grid-flow-row-dense" >
      
      {
        renderedStats
      }
    
    </div>
    </div>
    </div></div>
    
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
const numberComparison = ['=', '<', '>']
const statFilterMap = new Map<string,[string,  string[] ]>(
  [
  
  ["hp",['hp',numberComparison]],
  ["cost",['Cost',numberComparison]],
  ['mass',['Mass',numberComparison]],
  ['speed',['Speed',numberComparison]],
  ['range',['Range',numberComparison]],
  ['dps',['DPS',numberComparison]],
  ['damage',['Burst Damage',numberComparison]],
  ['radius', ['Size', numberComparison]],
  ['thrust',['Thrust',numberComparison]],
  ['turnSpeed',['Turn Rate',numberComparison]],
  ['genEnergy',['Energy Generaton',numberComparison]],
  ['storeEnergy',['Energy Storage',numberComparison]],
  ['moveEnergy',['Movement Energy', numberComparison]],
  ['fireEnergy',['Firing Energy', numberComparison]],
  ['shield',['Shield', numberComparison]]

])

export default function Home() {



  const [page,setPage] = useState(0)
  const [filters,setFilter] =  useState(new Map<FilterName, FilterOptions>())
  const [selectedShips, setSelectedShips] = useState( new Map<number,{id:number,stats:object,name:string, img:string}>())
  const [comparedShips, setComparedShips] = useState([])
  const [uploadShipShown, setUploadShipShown] = useState(false)
  const utils = api.useUtils()
  // const [queryState, setQueryState] = useState(true)

  const shipQuery= api.ships.getShips.useQuery({
    count:20,
    page: page,
    filters: filters
  }
  // ,{
  //   enabled:false
  // }

)

const availableFilters = ["hp", "mass", "speed"]

if(comparedShips.length >= 2){
  console.log("comparing ships!")
  const newMap = selectedShips
  const newShip1 = selectedShips.get(comparedShips[0])
  newShip1.statsToCompare = selectedShips.get(comparedShips[1])?.stats
  newMap.delete(comparedShips[0])
  //setSelectedShips(newMap);
  newMap.set(comparedShips[0], newShip1)
  const newShip2 = selectedShips.get(comparedShips[1])
  newShip2.statsToCompare = selectedShips.get(comparedShips[0])?.stats
  newMap.delete(comparedShips[1])
    //setSelectedShips(newMap);
  newMap.set(comparedShips[1], newShip2)
  setSelectedShips(newMap);
  setComparedShips([]);
  
}
console.log("re-render!")

function renderSelectedShip(){
  const renderedSelectedShips = []
  console.log(selectedShips)
  for (const ship of selectedShips){
  const selectedShip = ship[1]
  if (selectedShip.id < 0){
    continue
  }
  //console.log(selectedShip.stats.weapons)
  let shipweapons = selectedShip.stats.weapons;
  let fixedStats = selectedShip.stats
  delete fixedStats.weapons
  delete fixedStats.ais
  delete fixedStats.center
  if(comparedShips.length >= 2){

  
  // if(selectedShip.id == comparedShips[0]){
  //   selectedShip.statsToCompare = selectedShips.get(comparedShips[1])?.stats
  // } else if( selectedShip.id == comparedShips[1]){
  //   selectedShip.statsToCompare = selectedShips.get(comparedShips[0])?.stats
  // }
  
  }
  renderedSelectedShips.push( 


  
  <DetailedShip
  key={selectedShip.id}
  img={selectedShip.img}
  stats = {fixedStats}
  name={selectedShip.name}
  weapons = {selectedShip.stats.weapons}
  clickFunction={setSelectedShips}
  id={selectedShip.id}
  statsToCompare={selectedShip.statsToCompare}
  compareFunction={setComparedShips}
  parts={selectedShip.parts}
  color={selectedShip.color}
  /> 
 )
  }
  
  return renderedSelectedShips
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

function renderModal(){
  if(uploadShipShown){
          return <Upload/>
        }
        return (<></>)
}

  return (

    
      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#cecece] text-gray-500">
      <div className=" flex justify-between">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem] ml-4">
            Shipyard
          </h1>


            
          <button className="mt-4 rounded-lg text-black text-2xl font-semibold text-center bg-black bg-opacity-10 px-4 py-1 my-4 mx-[10%] transition-colors duration-300 hover:bg-opacity-75 hover:text-white"
          onClick={
            (e)=>{
              setUploadShipShown(!uploadShipShown)
            }
          }
          >
          Upload a ship  
          </button>
      </div>
       <div className="flex my-2">

       
          </div>
                    {
   renderModal()
    }
          
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

          <div className="flex flex- flex-wrap mt-4 transition-all duration-300">



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

            {Filter({availableFilters: statFilterMap, apply: applyFilter})}

          </div>

          </form>


        </div>
        <div className="flex justify-center w-[100%]">
          <div className="flex justify-center gap-4 flex-wrap  overflow-auto py-4 mx-5">
          {renderSelectedShip()}

          </div>
          </div>
        { (shipQuery.isSuccess && shipQuery.data != null) && !shipQuery.isFetching ? 
          // Ships({ships:shipQuery.data})
                  ( <div className="mx-auto 2xl:flex  grid grid-cols-[repeat(auto-fill,_minmax(30%,_1fr))] justify-center flex-wrap px-4 py-16">
          
                  {
                    
                    shipQuery.data.map( (ship) => {
                      //i+=1
                      return (
                      <Ship
                      key = {ship.id}
                      
                      id={ship.id}
                      name = {ship.name}
                      parts= {ship.parts}
                      selected = {selectedShips.has(ship.id)}
                      clickFunction= {setSelectedShips}
                      color = {ship.color}
                      
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
