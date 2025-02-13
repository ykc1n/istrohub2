import { createTRPCRouter, publicProcedure } from "../trpc";
import { string, z } from "zod";
import { drawShip,getStats } from "~/app/shipey/shipey";
import { DummyShipArr } from "./shipArrData";
import { count } from "console";
import { ships } from "~/server/db/schema";
import { Sql } from "postgres";
import { SQL,exists, sql, and, not, isNull, eq} from "drizzle-orm";





export  const shiprouter = createTRPCRouter({
    getShip: publicProcedure.
    input(z.object({ name: z.string() })).
    query( async ({input}) => {
        //let shipsref = collection(db, "ships")

        return {data:"no ship found"}
    }),

    getShips: publicProcedure.
    input(z.object({
        count: z.number(),
        page: z.number(),
        filters: z.map(z.string(),z.object({condition: z.string(), value: z.string()}))
   

    }))
    .query( async ({input, ctx}) => {
        const filter:SQL[] = []
        console.log(input)
        
        for( const f of input.filters){
            const condition = f[1].condition
            let  comparitor = f[1].value
            // console.log(f[1])
            // if(f[0] != "name"){
            //     f[0] = 
            // }
            let term = ''
            if(f[0] == "name"){
                term =  `stats->>'${f[0]}'`
                 comparitor = `'${comparitor}'`
            } else {
                 term =  `CAST(stats->'${f[0]}' AS INTEGER)`

            }

            console.log(`${term} ${condition} ${comparitor}`)
            filter.push(sql.raw(`${term} ${condition} ${comparitor}`))
           
        }
        console.log(filter);
        const q = await ctx.db
        .select({id:ships.id, name: ships.name , parts: ships.shipey_json})
        .from(ships)
        .where(
            and(
            not( isNull(ships.name) ),
            not( isNull(ships.shipey_json)),
            ...filter
        )
    )
        .orderBy(ships.id)

        .limit(input.count)
        .offset(input.page * input.count)



           return q


    }),

//     migrate: publicProcedure.
//     input( z.object({
//         oldShips: 
       
//         z.object({
//             id: z.number().positive(),
//             shipeyJSON: z.string(),
//             stats: z.string()
//         })
//     .array()
//     })
// ).
//     mutation( async ({input, ctx})=>{

//         await Promise.all(
//          input.oldShips.map(   async (ship) =>   {
//             console.log(ship.shipeyJSON);
//          await ctx.db.
//            update(ships)
//            .set({
//             stats:  sql`${ship.stats}::jsonb`
//            ,
//             shipey_json:  sql`${ship.shipeyJSON}::jsonb`
//            })
//            .where(
//             eq(ships.id, ship.id)
//            )
//         })
//     )
       

//     })



})