import Ship from "./ship"


let i = 0

export function Ships(props:{ships:ShipData[]}){
    console.log(props.ships)
    return (
        <div className="mx-36 flex  flex-wrap px-4 py-16">

        {
          
          props.ships.map( (ship:ShipData) => {
            i+=1
            return (
            Ship(ship)
            )
          })
        
        }

                    
          </div>
    )
}