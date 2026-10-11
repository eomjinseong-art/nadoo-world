"use client";

import { useMemo, useState } from "react";
import { Flag } from "@/components/Flag";
import { capitalLine, countries, countryByIso, formatArea, formatDensity, formatPop, groupedZones, visibleReligions } from "@/lib/countries";

export function CompareTool() {
  const [left, setLeft] = useState("KR");
  const [right, setRight] = useState("JP");
  const a = countryByIso(left) ?? countries[0];
  const b = countryByIso(right) ?? countries[1];
  const pairs = useMemo(
    () => [
      { label: "면적", av: a.areaKm2, bv: b.areaKm2, at: formatArea(a.areaKm2), bt: formatArea(b.areaKm2) },
      {
        label: "인구",
        av: a.populationRanked ? a.population || 0 : 0,
        bv: b.populationRanked ? b.population || 0 : 0,
        at: a.population ? formatPop(a.population) : "자료 없음",
        bt: b.population ? formatPop(b.population) : "자료 없음",
      },
      {
        label: "밀도",
        av: a.populationRanked ? a.density || 0 : 0,
        bv: b.populationRanked ? b.density || 0 : 0,
        at: a.density != null ? formatDensity(a.density) : "—",
        bt: b.density != null ? formatDensity(b.density) : "—",
      },
    ],
    [a, b],
  );

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Picker value={left} onChange={setLeft} />
        <Picker value={right} onChange={setRight} />
      </div>
      {(!a.populationRanked || !b.populationRanked) && (
        <p className="mt-3 text-xs leading-5 text-muted">인구·밀도 막대는 세계은행 2025년 값이 있는 나라만 그립니다. 다른 출처의 인구는 숫자로만 적습니다.</p>
      )}
      <div className="mt-6 space-y-5">
        {pairs.map((pair) => {
          const max = Math.max(pair.av, pair.bv, 1);
          return (
            <div key={pair.label}>
              <p className="text-sm font-medium">{pair.label}</p>
              <Bar name={a.nameKo} text={pair.at} width={(pair.av / max) * 100} />
              <Bar name={b.nameKo} text={pair.bt} width={(pair.bv / max) * 100} />
            </div>
          );
        })}
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card iso={a.iso2} />
        <Card iso={b.iso2} />
      </div>
    </div>
  );
}

function Picker({ value, onChange }: { value: string; onChange: (iso: string) => void }) {
  return (
    <label className="block text-sm">
      <span className="text-xs text-muted">나라</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-md border border-line bg-card px-3 py-2">
        {countries.map((country) => (
          <option key={country.iso2} value={country.iso2}>
            {country.nameKo}
          </option>
        ))}
      </select>
    </label>
  );
}

function Bar({ name, text, width }: { name: string; text: string; width: number }) {
  return (
    <div className="mt-1">
      <div className="flex justify-between text-xs text-muted">
        <span>{name}</span>
        <span>{text}</span>
      </div>
      <div className="mt-1 h-3 rounded-full bg-stone">
        <div className="h-3 rounded-full bg-terra" style={{ width: `${Math.max(width, 2)}%` }} />
      </div>
    </div>
  );
}

function Card({ iso }: { iso: string }) {
  const country = countryByIso(iso);
  if (!country) return null;
  const religion = visibleReligions(country)
    .slice(0, 3)
    .map((item) => `${item.ko} ${item.pct}%`)
    .join(" · ");
  return (
    <article className="rounded-lg border border-line bg-card p-4 text-sm">
      <div className="flex items-center gap-3">
        <Flag iso={country.iso2} title="" />
        <h2 className="font-serif text-xl">{country.nameKo}</h2>
      </div>
      <p className="mt-2 text-muted">{capitalLine(country)}</p>
      <p className="mt-2">{country.languages.map((language) => language.ko).join(", ") || "언어 자료 없음"}</p>
      <p className="mt-1 text-muted">{religion || "종교 전망치 없음"}</p>
      <p className="mt-1">{country.currencies.map((item) => `${item.ko} (${item.code})`).join(", ") || "통화 자료 없음"}</p>
      <ul className="mt-2 space-y-1 text-xs text-muted">
        {groupedZones(country).map((zone) => (
          <li key={zone.label}>
            {zone.label} · {zone.diffStd}
          </li>
        ))}
      </ul>
    </article>
  );
}
