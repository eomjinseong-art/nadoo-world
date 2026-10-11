"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Flag } from "@/components/Flag";
import { WorldMap } from "@/components/WorldMap";
import { capitalLine, countries, countryByIso, countryOfDay, formatArea, formatPop, regionKo } from "@/lib/countries";

const REGIONS = ["all", "Asia", "Europe", "Africa", "Americas", "Oceania"] as const;

export function HomeExplorer() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("all");
  const [iso, setIso] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const today = useMemo(() => countryOfDay(), []);
  const selected = iso ? countryByIso(iso) : null;

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-3">
        {REGIONS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRegion(item)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${region === item ? "bg-terra text-white" : "border border-line bg-card text-muted"}`}
          >
            {item === "all" ? "전체" : regionKo(item)}
          </button>
        ))}
      </div>
      <WorldMap
        region={region}
        selected={iso}
        onSelect={(next, nextNote) => {
          setIso(next);
          setNote(nextNote);
        }}
      />
      <p className="mt-2 text-xs leading-5 text-muted">
        경계는 내추럴 어스(Natural Earth) 50m 공개 지도입니다. 카슈미르, 크림, 서사하라처럼 지위가 갈리는 곳은 특정 나라의 주장으로 칠하지 않았습니다. 투발루처럼 아주 작은 나라는 면 대신 점으로만 보일 수 있습니다. 남극은 빼 두었습니다.
      </p>
      {note ? <p className="mt-3 rounded-md border border-line bg-card p-3 text-sm leading-6">{note}</p> : null}
      {selected ? (
        <article className="mt-3 rounded-lg border border-line bg-card p-4">
          <div className="flex items-start gap-3">
            <Flag iso={selected.iso2} title={`${selected.nameKo} 국기`} className="h-12 w-16 rounded-sm border border-line bg-white object-contain" />
            <div>
              <h2 className="font-serif text-2xl text-ink">{selected.nameKo}</h2>
              <p className="text-xs text-terra">
                {selected.nameEn} · {selected.iso2}
              </p>
              <p className="mt-1 text-sm text-muted">
                {capitalLine(selected)} · {formatArea(selected.areaKm2)}
                {selected.population ? ` · ${formatPop(selected.population)}` : ""}
              </p>
            </div>
          </div>
          <Link href={`/countries/${selected.iso2.toLowerCase()}`} className="mt-3 inline-block text-sm text-laurel underline">
            카드 열기
          </Link>
        </article>
      ) : null}

      <article className="mt-6 rounded-lg border border-line bg-card p-5">
        <p className="text-[11px] tracking-[0.16em] text-terra">오늘의 나라 · {today.key}</p>
        <div className="mt-2 flex items-start gap-3">
          <Flag iso={today.country.iso2} title="" className="h-14 w-20 rounded-sm border border-line bg-white object-contain" />
          <div>
            <h2 className="font-serif text-2xl">{today.country.nameKo}</h2>
            <p className="text-sm text-muted">
              {today.country.nameEn} · {capitalLine(today.country)}
            </p>
            <p className="mt-1 text-sm leading-6 text-muted">
              {today.country.regionKo} · {formatArea(today.country.areaKm2)}
              {today.country.population ? ` · ${formatPop(today.country.population)}` : ""}
            </p>
          </div>
        </div>
        <Link href={`/countries/${today.country.iso2.toLowerCase()}`} className="mt-3 inline-block text-sm text-terra underline">
          이 나라부터 보기
        </Link>
        <p className="mt-2 text-xs text-muted">날짜는 한국 표준시입니다. 새로고침해도 같은 날이라면 같은 나라가 나옵니다. 나라 수 {countries.length}.</p>
      </article>
    </div>
  );
}
