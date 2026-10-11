"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Flag } from "@/components/Flag";
import { capitalLine, countries, regionKo, type Country } from "@/lib/countries";

export function CountryBrowser() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [land, setLand] = useState(false);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return countries.filter((country) => {
      if (region !== "all" && country.region !== region) return false;
      if (status !== "all" && country.status !== status) return false;
      if (land && !country.landlocked) return false;
      if (!q) return true;
      const blob = [country.nameKo, country.nameEn, country.iso2, country.iso3, ...country.capitals.flatMap((capital) => [capital.ko, capital.en])]
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [query, region, status, land]);

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="block text-sm">
          <span className="text-xs text-muted">검색</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="나라, 수도, ISO"
            className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="text-xs text-muted">대륙</span>
          <select value={region} onChange={(event) => setRegion(event.target.value)} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2">
            <option value="all">전체</option>
            {["Asia", "Europe", "Africa", "Americas", "Oceania"].map((item) => (
              <option key={item} value={item}>
                {regionKo(item)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs text-muted">지위</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2">
            <option value="all">전체</option>
            <option value="un">유엔 회원국</option>
            <option value="observer">옵서버</option>
            <option value="partial">일부 승인</option>
          </select>
        </label>
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm">
        <input type="checkbox" checked={land} onChange={(event) => setLand(event.target.checked)} />
        내륙국만
      </label>
      <p className="mt-3 text-xs text-muted">{shown.length}곳</p>
      <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-card">
        {shown.map((country) => (
          <li key={country.iso2}>
            <CountryRow country={country} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CountryRow({ country }: { country: Country }) {
  return (
    <Link href={`/countries/${country.iso2.toLowerCase()}`} className="flex items-center gap-3 px-3 py-3 hover:bg-stone/60">
      <Flag iso={country.iso2} title="" />
      <span className="min-w-0 flex-1">
        <span className="block font-medium text-ink">{country.nameKo}</span>
        <span className="block truncate text-xs text-muted">
          {country.nameEn} · {capitalLine(country)}
        </span>
      </span>
      <span className="shrink-0 text-[11px] text-terra">{country.regionKo}</span>
    </Link>
  );
}
