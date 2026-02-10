"use client";
/*
Note: "use client" is a Next.js App Router directive that tells React to render the component as
a client component rather than a server component. This establishes the server-client boundary,
providing access to client-side functionality such as hooks and event handlers to this component and
any of its imported children. Although the SpeciesCard component itself does not use any client-side
functionality, it is beneficial to move it to the client because it is rendered in a list with a unique
key prop in species/page.tsx. When multiple component instances are rendered from a list, React uses the unique key prop
on the client-side to correctly match component state and props should the order of the list ever change.
React server components don't track state between rerenders, so leaving the uniquely identified components (e.g. SpeciesCard)
can cause errors with matching props and state in child components if the list order changes.
*/
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import type { Database } from "@/lib/schema";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import EditSpeciesDialog from "./edit-species-dialog";

type Species = Database["public"]["Tables"]["species"]["Row"];

export default function SpeciesCard({ species, userId }: { species: Species, userId: string }) {
  const [open, setOpen] = useState<boolean>(false);
  
  return (
    <div className="m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      {species.image && (
        <div className="relative h-40 w-full">
          <Image src={species.image} alt={species.scientific_name} fill style={{ objectFit: "cover" }} />
        </div>
      )}
      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      
      <div className="mt-3 flex flex-nowrap gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost"className="min-w-0 flex-1">Learn More</Button>
          </DialogTrigger>
          <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Species information</DialogTitle>
              <DialogDescription>
                Here&apos;s a great place to learn more about this species! Stay in school, kids.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-6">
              <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-s border">
                <div className="divide-y">
                  <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 text-sm">
                    <div className="font-medium text-muted-foreground">Common name</div>
                    <div>{species.common_name ?? "Unknown"}</div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 text-sm">
                    <div className="font-medium text-muted-foreground">Scientific name</div>
                    <div className="italic">{species.scientific_name ?? "Unknown"}</div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 text-sm">
                    <div className="font-medium text-muted-foreground">Kingdom</div>
                    <div>{species.kingdom ?? "Unknown"}</div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 text-sm">
                    <div className="font-medium text-muted-foreground">Total population</div>
                    <div>
                      {species.total_population === null ||
                      species.total_population === undefined
                        ? "Unknown"
                        : Number(species.total_population).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-[160px_1fr] gap-3 px-4 py-3 text-sm">
                    <div className="font-medium text-muted-foreground">Description</div>
                    <div className="leading-relaxed">
                      {species.description ?? "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <EditSpeciesDialog species={species} userId={userId} />
      </div>
      
    </div>
  );
}
