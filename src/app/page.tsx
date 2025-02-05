import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import Ship from "./_components/ship";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <main className=" min-h-screen bg-gradient-to-b from-[#ffffff] to-[#9e9e9e] text-gray-500">
      <div className="bg-slate-100">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
            Istrohub
          </h1>

          
      </div>
      
          
        <div className="flex justify-center">
          <button className="p-2 rounded-xl bg-slate-500 text-slate-50 transition-colors hover:text-slate-50 hover:bg-slate-400">
          Upload a ship  
          </button>
        </div>

        <div className="mx-36 flex   px-4 py-16">
          

          <Ship/>
          <Ship/>
          <Ship/>
                      
            </div>
          </main>
        </HydrateClient>
      );
}
