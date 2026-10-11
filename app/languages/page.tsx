import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { countries } from "@/lib/countries";
import { carouselHref, learnHref } from "@/lib/links";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "언어",
  description: "데이터셋에 올라 있는 언어별로 어느 나라가 쓰는지 모았습니다.",
  path: "/languages",
});

const LEARN = [
  ["영어", "en"],
  ["일본어", "ja"],
  ["스페인어", "es"],
  ["이탈리아어", "it"],
  ["러시아어", "ru"],
  ["프랑스어", "fr"],
] as const;

export default function LanguagesPage() {
  const map = new Map<string, { en: string; isos: string[] }>();
  for (const country of countries) {
    for (const language of country.languages) {
      const row = map.get(language.ko) ?? { en: language.en, isos: [] };
      row.isos.push(country.iso2);
      map.set(language.ko, row);
    }
  }
  const rows = [...map.entries()].sort((a, b) => b[1].isos.length - a[1].isos.length || a[0].localeCompare(b[0], "ko"));
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead kicker="LANGUAGES" title="언어" lead="mledoze/countries에 적힌 이름만 모았습니다. 헌법의 공용어가 더 많은 나라는 일부가 빠져 있을 수 있습니다." />
      <section className="mt-6 rounded-lg border border-line bg-card p-4">
        <h2 className="font-serif text-xl">나두랭귀지에서 배우기</h2>
        <ul className="mt-3 flex flex-wrap gap-3 text-sm">
          {LEARN.map(([label, code]) => (
            <li key={code}>
              <a href={learnHref(code)} className="text-laurel underline" target="_blank" rel="noopener noreferrer">
                {label}
              </a>
              <a href={carouselHref(code)} className="ml-2 text-xs text-muted underline" target="_blank" rel="noopener noreferrer">
                카드
              </a>
            </li>
          ))}
        </ul>
      </section>
      <ul className="mt-6 space-y-4">
        {rows.map(([ko, row]) => (
          <li key={ko}>
            <h2 className="font-medium">
              {ko} <span className="text-xs text-muted">{row.en} · {row.isos.length}곳</span>
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted">
              {row.isos.map((iso, index) => {
                const country = countries.find((item) => item.iso2 === iso);
                return (
                  <span key={iso}>
                    {index > 0 ? " · " : ""}
                    <Link href={`/countries/${iso.toLowerCase()}`} className="underline">
                      {country?.nameKo}
                    </Link>
                  </span>
                );
              })}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
