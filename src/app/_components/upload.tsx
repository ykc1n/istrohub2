'use client'

import { useRef, useState } from "react";
import Image  from 'next/image'
import { drawShip, getStats, hexToRgb} from "../shipey/shipey";
import { api } from "~/trpc/react";

type Spec = {
    name: string,
    parts: object[],
    aiRules: unknown[]
}

export default function Upload(
    props:{
        closeFunction: (boolean)=>void,
    }
){

    const [img, setImg] = useState('');
    const [color,setColor] = useState('FFFFFF')
    const [error,setError] = useState(false)
    const [title, setTitle] = useState('')
    const [shipey,setShipey] = useState('')
    
    const uploadShip = api.ships.uploadShip.useMutation()

    async function changeImage(src:string, clr:string){
        try{
        const spec = JSON.parse(atob(src.slice(4))) as Spec 
        const stats = getStats(spec);
        setTitle(spec.name)
        const i = await drawShip(spec,stats,hexToRgb(clr))
        setImg(i);
        setShipey(src)
        setError(false)
        } catch(e){
        
            setImg('')
        setError(true)
        }
    }
    return (
        <div

        className="p-12 r3xl flex justify-center">
            
            <div className="bg-black bg-opacity-20 p-4 rounded-xl">
                <div>
                        <button className="p-1 px-3 rounded-full bg-opacity-50 font-bold bg-black transition-color duration-300 hover:bg-red-600 hover:bg-opacity-75 hover:text-black"
                        onClick={()=>{
                            props.closeFunction(false)
                        }}
                        >
                            X
                        </button>
                    </div>
                <p className="font-bold text-neutral-300 text-5xl p-5">Ship Upload</p>
                <form 
                action={(e)=>{
                    
                            if(img==''){
                                setError(true)
                                return
                            }  
                            const spec = JSON.parse(atob(shipey.slice(4))) as Spec
                            const name = e.get('title') == '' ? spec.name??' ' : e.get('title') as string
                            console.log(name)
                            console.log(color)
                           
                            console.log(spec)
                            console.log(getStats(spec))
                            const stats = getStats(spec)

                            uploadShip.mutate({
                                title: name??"",
                                stats: stats,
                                parts: spec,
                                color: color
                            })
                        }
                }
                >
                    <p className="text-center">Name your ship</p> 
                    <div className="flex justify-center py-2">  
                                         
                    <input type="text" name="title" className="bg-black bg-opacity-40 text-xl font-semibold text-center rounded mx-auto transition-all duration-300 hover:bg-opacity-60 p-2" />
                </div>
                {title!=''?(
                    <h1 className="italic text-center">{title}</h1>
                ) : <></>}
                    <div>

                        {
                            img!=''? (
                        <Image
                        width={500}
                        height={500}
                        alt="none"
                        src={img}
                        >

                        </Image>
                        ) :
                        <div>

                        </div>
                        }
                    
                    </div>
                    <p className="text-center my-3">Paste shipey code</p>
                    <div className="flex justify-center ">
                    <input type="text" className="bg-black bg-opacity-40 text-xl font-semibold text-center rounded mx-auto transition-all duration-300 hover:bg-opacity-60 p-2"
                    onChange={
                        (e)=>{
                            void changeImage(e.target.value, color)
                        }
                    }

                    />
                    </div>
                        <p className="text-center my-3">
                            Ship color
                        </p>
                    <div className="my-4 flex justify-center">
                        
                    <input type="text" name='color' className="bg-black bg-opacity-40 text-xl font-semibold text-center rounded mx-auto transition-all duration-300 hover:bg-opacity-60 p-2"
                    onChange={
                        (e)=>{
                            console.log(hexToRgb(e.target.value))
                            const clr = hexToRgb(e.target.value)
                            if(clr){
                                setColor(e.target.value)
                                console.log(color)
                               void changeImage(shipey, e.target.value)
                                console.log('recolord')
                            }
                        }
                    }
                    />
                    </div>

                    {
                    error ?
                    <div className="flex justify-center m-2">

                    
                    <div className="bg-red-600 p-2 bg-opacity-15 text-xl font-semibold text-black rounded text-center">
                    Invalid Ship
                    </div> </div>:
                    <></>
}
                    

                    <div className="flex justify-center">
                        <button type="submit" className="bg-black bg-opacity-40 text-lg font-bold p-2 transition-all duration-300 rounded-lg hover:bg-opacity-75 hover:text-white"
                        onSubmit={(e)=>{
                            e.preventDefault()
                        }}
                        >
                            Upload!
                        </button>
                    </div>

                    <div className={` text-center my-2 text-green-500 font-bold transition-all duration-300 ${uploadShip.isSuccess ? "visible ": " invisible "} `}>
                        {uploadShip.isSuccess? "Ship Uploaded!" : "Ship pending"}
                        
                    </div>

                    
                    </form> 
            </div>
           
            </div>
    )
}