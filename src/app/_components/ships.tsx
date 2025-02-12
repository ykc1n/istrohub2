'use client'
import Ship from "./ship"


let i = 0

export function Ships(props:{ships:ShipData[]}){
    //console.log(props.ships)
    return (
        <div className="mx-auto flex justify-center flex-wrap px-4 py-16">

        {
          
          props.ships.map( (ship:ShipData) => {
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

                    
          </div>
    )
}