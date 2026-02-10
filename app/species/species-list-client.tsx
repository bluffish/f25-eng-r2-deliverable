"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import SpeciesCard from "./species-card";

interface Species {
  id: number;
  scientific_name: string;
  common_name: string | null;
  description: string | null;
  [key: string]: any;
}

export default function SpeciesListClient({ species, userId }: { species: Species[]; userId: string }) {
  const [query, setQuery] = useState("");

  const filtered = species.filter((s) => {
    if (!query.trim()) return true;
    const lower = query.toLowerCase();
    return (
      s.scientific_name?.toLowerCase().includes(lower) ||
      s.common_name?.toLowerCase().includes(lower) ||
      s.description?.toLowerCase().includes(lower)
    );
  });

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Search by name, scientific name, or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap justify-center">
        {filtered.map((s) => (
          <SpeciesCard key={s.id} species={s} userId={userId} />
        ))}
        {filtered.length === 0 && (
          <p className="text-muted-foreground mt-4">No species found matching &quot;{query}&quot;</p>
        )}
      </div>
    </>
  );
}