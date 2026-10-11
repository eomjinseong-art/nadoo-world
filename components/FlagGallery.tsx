"use client";

import Link from "next/link";
import { useState } from "react";
import { Flag } from "@/components/Flag";
import flags from "@/data/flags.json";
import { countries, regionKo } from "@/lib/countries";

export function FlagGallery() {
  const [region, setRegion] = useState("all");
  const shown = countries.filter((country) => region === "all" || country.region === region);
  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {["all", "Asia", "Europe", "Africa", "Americas", "Oceania"].map((item) => (
          <button key={item} type="button" onClick={() => setRegion(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${region === item ? "bg-terra text-white" : "border border-line bg-card"}`}>
            {item === "all" ? "전체" : regionKo(item)}
          </button>
        ))}
        <Link href="/flags/lookalikes" className="shrink-0 rounded-full border border-terra px-3 py-1.5 text-sm text-terra">
          헷갈리는 국기
        </Link>
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((country) => {
          const note = flags[country.iso2 as keyof typeof flags];
          return (
            <li key={country.iso2}>
              <Link href={`/countries/${country.iso2.toLowerCase()}`} className="block rounded-lg border border-line bg-card p-3 hover:border-terra">
                <Flag iso={country.iso2} title={`${country.nameKo} 국기`} className="h-16 w-full rounded-sm border border-line bg-white object-contain" />
                <p className="mt-2 font-medium">{country.nameKo}</p>
                <p className="text-xs text-muted">{note?.year || country.nameEn}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
