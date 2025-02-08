import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";
import { drawShip,getStats } from "~/app/shipey/shipey";
import { DummyShipArr } from "./shipArrData";
import { count } from "console";
import { ships } from "~/server/db/schema";
import { Sql } from "postgres";
import { exists, sql, and, not, isNull} from "drizzle-orm";
declare global {
    interface ShipData {
    name:string,
    shipey:string
}
}

const shipDataSchema  = z.object({
    name: z.string(),
    shipeycode: z.string(),
})



export  const shiprouter = createTRPCRouter({
    getShip: publicProcedure.
    input(z.object({ name: z.string() })).
    query( async ({input}) => {
        //let shipsref = collection(db, "ships")
        
        return {data:"no ship found"}
    }),

    getShips: publicProcedure.
    input(z.object({
        count: z.number()
    }))
    .query( async ({input, ctx}) => {
        
        const q = await ctx.db
        .select({name: ships.name , shipey: ships.shipey})
        .from(ships)
        .where(
            and(
            not( isNull(ships.name) ),
            not( isNull(ships.shipey))
        ))
        .limit(input.count)
        
       

           return q
        

    })


})