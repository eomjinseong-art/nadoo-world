"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { countries, formatArea, formatDensity, formatPop, peninsulaAreaKm2, similarToPeninsula, type Country } from "@/lib/countries";

type Key = "area" | "population" | "density";

export function RankingsBoard() {
  const [key, setKey] = useState<Key>("area");
  const [dir, setDir] = useState<"desc" | "asc">("desc");
  const rows = useMemo(() => {
    const list = countries.filter((country) => (key === "area" ? true : country.populationRanked && country.population && country.density != null));
    const value = (country: Country) => (key === "area" ? country.areaKm2 : key === "population" ? country.population || 0 : country.density || 0);
    return [...list].sort((a, b) => (dir === "desc" ? value(b) - value(a) : value(a) - value(b)));
  }, [key, dir]);
  const preview = dir === "desc" ? rows.slice(0, 10) : rows.slice(0, 10);
  const target = peninsulaAreaKm2();
  const similar = similarToPeninsula(8);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["area", "면적"],
            ["population", "인구"],
            ["density", "밀도"],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setKey(id)} className={`rounded-full px-3 py-1.5 text-sm ${key === id ? "bg-terra text-white" : "border border-line bg-card"}`}>
            {label}
          </button>
        ))}
        <button type="button" onClick={() => setDir((value) => (value === "desc" ? "asc" : "desc"))} className="rounded-full border border-line bg-card px-3 py-1.5 text-sm">
          {dir === "desc" ? "큰 순" : "작은 순"}
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted">
        인구·밀도 순위는 세계은행 2025년 인구가 있는 나라만 넣습니다. 대만과 바티칸은 다른 출처라 이 표의 순위에서 빼 두었습니다. 면적 순위는 카드 197곳을 함께 셉니다.
      </p>
      <ol className="mt-4 grid gap-2 sm:grid-cols-2">
        {preview.map((country, index) => (
          <li key={country.iso2}>
            <Link href={`/countries/${country.iso2.toLowerCase()}`} className="flex items-baseline justify-between rounded-md border border-line bg-card px-3 py-2 text-sm hover:border-terra">
              <span>
                {index + 1}. {country.nameKo}
              </span>
              <span className="text-muted">{key === "area" ? formatArea(country.areaKm2) : key === "population" ? formatPop(country.population || 0) : formatDensity(country.density || 0)}</span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="mt-8 overflow-x-auto rounded-lg border border-line">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-stone text-xs text-muted">
            <tr>
              <th className="px-3 py-2">#</th>
              <th className="px-3 py-2">나라</th>
              <th className="px-3 py-2">값</th>
              <th className="px-3 py-2">자료 순위</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((country, index) => (
              <tr key={country.iso2} className="border-t border-line">
                <td className="px-3 py-2 tabular-nums">{index + 1}</td>
                <td className="px-3 py-2">
                  <Link href={`/countries/${country.iso2.toLowerCase()}`} className="underline decoration-line">
                    {country.nameKo}
                  </Link>
                  <span className="ml-2 text-xs text-muted">{country.nameEn}</span>
                </td>
                <td className="px-3 py-2 tabular-nums">{key === "area" ? formatArea(country.areaKm2) : key === "population" ? formatPop(country.population || 0) : formatDensity(country.density || 0)}</td>
                <td className="px-3 py-2 tabular-nums text-muted">{key === "area" ? country.areaRank : key === "population" ? country.populationRank : country.densityRank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">한반도와 비슷한 크기의 나라</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          같은 데이터셋에서 대한민국 {formatArea(countries.find((c) => c.iso2 === "KR")?.areaKm2 || 0)}과 조선민주주의인민공화국 {formatArea(countries.find((c) => c.iso2 === "KP")?.areaKm2 || 0)}을 더하면 {formatArea(target)}입니다. 아래는 그 합과 차이가 작은 순입니다. 국경의 정치적 의미가 아니라 면적 비교입니다.
        </p>
        <ul className="mt-3 space-y-2 text-sm">
          {similar.map(({ country, gap }) => (
            <li key={country.iso2}>
              <Link href={`/countries/${country.iso2.toLowerCase()}`} className="text-laurel underline">
                {country.nameKo}
              </Link>
              <span className="ml-2 text-muted">
                {formatArea(country.areaKm2)} · 차이 {(gap * 100).toFixed(1)}%
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
