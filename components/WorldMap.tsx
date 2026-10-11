"use client";

import { useMemo, useState } from "react";
import mapData from "@/data/map.json";

const FILL: Record<string, string> = {
  Africa: "#e4d3b4",
  Americas: "#efc2b2",
  Asia: "#d5e0cc",
  Europe: "#e3d0d8",
  Oceania: "#d0e0e6",
};

export function WorldMap({
  selected,
  onSelect,
  region = "all",
  quiz = false,
}: {
  selected: string | null;
  onSelect: (iso: string | null, note: string | null) => void;
  region?: string;
  quiz?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const view = useMemo(() => {
    if (region === "all") return `0 0 ${mapData.width} ${mapData.height}`;
    const boxes = mapData.features.filter((item) => item.kind === "country" && item.region === region);
    if (!boxes.length) return `0 0 ${mapData.width} ${mapData.height}`;
    const x0 = Math.min(...boxes.map((item) => item.bbox[0]));
    const y0 = Math.min(...boxes.map((item) => item.bbox[1]));
    const x1 = Math.max(...boxes.map((item) => item.bbox[2]));
    const y1 = Math.max(...boxes.map((item) => item.bbox[3]));
    const pad = 18;
    return `${x0 - pad} ${y0 - pad} ${x1 - x0 + pad * 2} ${y1 - y0 + pad * 2}`;
  }, [region]);

  const capitals = mapData.capitals.filter((dot) => region === "all" || dot.region === region);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-[#d7e4ea]">
      <svg viewBox={view} role="img" aria-label={quiz ? "나라를 고르는 세계 지도" : "세계 지도"} className="h-auto w-full touch-manipulation">
        <rect x={-20} y={-20} width={mapData.width + 40} height={mapData.height + 40} fill="#d7e4ea" />
        {mapData.features.map((item, index) => {
          const active = item.iso && item.iso === selected;
          const faded = region !== "all" && item.region !== region;
          const fill = item.kind === "country" ? FILL[item.region || ""] || "#ddd" : item.kind === "disputed" ? "#d5cfc4" : "#e7e2d8";
          return (
            <path
              key={`${item.iso ?? item.name}-${index}`}
              d={item.d}
              fill={active ? "#a34732" : fill}
              fillOpacity={faded ? 0.28 : 1}
              stroke={item.kind === "disputed" ? "#8a8176" : "#fff"}
              strokeWidth={item.kind === "disputed" ? 0.6 : 0.4}
              strokeDasharray={item.kind === "disputed" ? "1.5 1.2" : undefined}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={item.name || "지도 구역"}
              onMouseEnter={() => setHover(item.name)}
              onMouseLeave={() => setHover(null)}
              onClick={() => {
                if (item.iso) onSelect(item.iso, null);
                else if (item.kind === "disputed") onSelect(null, `${item.name}은 이 지도에 별도 면으로 있습니다. 국제적 지위는 엇갈리며, 이 사이트는 특정 입장을 취하지 않습니다.`);
                else onSelect(null, `${item.name || "이 구역"}은 유엔 회원국 카드가 아닙니다. 속령·기타 지명으로만 보여 줍니다.`);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  (event.currentTarget as SVGPathElement).dispatchEvent(new MouseEvent("click", { bubbles: true }));
                }
              }}
            />
          );
        })}
        {capitals.map((dot) => (
          <g key={`${dot.iso}-${dot.name}`}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r={8}
              fill="transparent"
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${dot.name}, ${dot.iso}`}
              onClick={() => onSelect(dot.iso, null)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(dot.iso, null);
                }
              }}
            />
            <circle cx={dot.x} cy={dot.y} r={2.2} fill="#7d3324" pointerEvents="none" />
            {region !== "all" || selected === dot.iso ? (
              <text x={dot.x + 4} y={dot.y - 4} fontSize={8} fill="#241c16" pointerEvents="none">
                {dot.name}
              </text>
            ) : null}
          </g>
        ))}
      </svg>
      {hover ? <p className="border-t border-line bg-card px-3 py-1.5 text-xs text-muted">{hover}</p> : null}
    </div>
  );
}
