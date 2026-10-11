import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flag } from "@/components/Flag";
import { JsonLd } from "@/components/JsonLd";
import flags from "@/data/flags.json";
import stories from "@/data/stories.json";
import { capitalLine, countries, countryByIso, formatArea, formatDensity, formatPop, groupedZones, neighborNames, visibleReligions, learnLanguages } from "@/lib/countries";
import { carouselHref, learnHref, sisterLinks } from "@/lib/links";
import { articleLd, breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";
import { TIMELINE_URL } from "@/lib/site";

type Params = { iso: string };

export function generateStaticParams() {
  return countries.map((country) => ({ iso: country.iso2.toLowerCase() }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { iso } = await params;
  const country = countryByIso(iso);
  if (!country) return {};
  const capital = capitalLine(country);
  return pageMetadata({
    title: `${country.nameKo}`,
    description: `${country.nameKo}(${country.nameEn}). ${capital}. ${country.statusKo}. 면적 ${formatArea(country.areaKm2)}.`,
    path: `/countries/${country.iso2.toLowerCase()}`,
    type: "article",
  });
}

export default async function CountryPage({ params }: { params: Promise<Params> }) {
  const { iso } = await params;
  const country = countryByIso(iso);
  if (!country) notFound();
  const story = stories[country.iso2 as keyof typeof stories];
  const flag = flags[country.iso2 as keyof typeof flags];
  const path = `/countries/${country.iso2.toLowerCase()}`;
  const links = sisterLinks(country);
  const learn = learnLanguages(country);
  const zones = groupedZones(country);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          breadcrumbLd([
            { name: "홈", path: "/" },
            { name: "나라", path: "/countries" },
            { name: country.nameKo, path },
          ]),
          articleLd({
            headline: `${country.nameKo} · ${country.nameEn}`,
            description: `${country.statusKo}. ${capitalLine(country)}.`,
            path,
          }),
        ])}
      />
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { href: "/countries", label: "나라" }, { label: country.nameKo }]} />
      <div className="flex items-start gap-4">
        <Flag iso={country.iso2} title={`${country.nameKo} 국기`} className="h-20 w-28 rounded-sm border border-line bg-white object-contain" />
        <div>
          <p className="text-[11px] tracking-[0.16em] text-terra">{country.nameEn}</p>
          <h1 className="font-serif text-4xl">{country.nameKo}</h1>
          <p className="mt-1 text-sm text-muted">
            {country.nameKoOfficial} · {country.nameEnOfficial}
          </p>
          <p className="mt-2 text-sm">
            {country.statusKo} · {country.regionKo} · {country.subregionKo}
            {country.landlocked ? " · 내륙국" : ""}
          </p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Stat label="면적" value={`${formatArea(country.areaKm2)} · ${country.areaRank}위`} />
        <Stat
          label="인구"
          value={country.population ? `${formatPop(country.population)}${country.populationRank ? ` · ${country.populationRank}위` : " · 순위 밖"}` : "자료 없음"}
        />
        <Stat label="밀도" value={country.density != null ? `${formatDensity(country.density)}${country.densityRank ? ` · ${country.densityRank}위` : ""}` : "—"} />
        <Stat label="ISO" value={`${country.iso2} / ${country.iso3}`} />
        <Stat label="전화" value={country.callingCode || "—"} />
        <Stat label="통화" value={country.currencies.map((item) => `${item.ko} ${item.code}`).join(", ") || "—"} />
      </dl>
      {country.areaNote ? <p className="mt-3 text-xs leading-5 text-muted">{country.areaNote}</p> : null}
      {country.currencyNote ? <p className="mt-2 text-xs leading-5 text-muted">{country.currencyNote}</p> : null}

      <section className="mt-8">
        <h2 className="font-serif text-2xl">수도</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {country.capitals.map((capital) => (
            <li key={capital.en}>
              <span className="font-medium">{capital.ko}</span>
              <span className="text-muted"> · {capital.en} · {capital.role}</span>
            </li>
          ))}
        </ul>
        {country.iso2 === "IL" ? (
          <p className="mt-2 text-xs leading-5 text-muted">이스라엘은 예루살렘을 수도로 둡니다. 이 지위는 나라마다 의견이 갈리고, 많은 대사관은 텔아비브에 있습니다.</p>
        ) : null}
        {country.iso2 === "PS" ? (
          <p className="mt-2 text-xs leading-5 text-muted">동예루살렘과 라말라는 역할이 다릅니다. 이 카드는 어느 쪽의 주장도 확정된 국경으로 적지 않습니다.</p>
        ) : null}
      </section>

      <section className="prose-site mt-8">
        <h2 className="font-serif text-2xl">수도 이야기</h2>
        {story?.level === "detail" ? (
          <div className="mt-3 space-y-3 text-sm leading-7">
            <p>{story.origin}</p>
            <p>{story.became}</p>
            <p>{story.history}</p>
            <p>{story.anecdote}</p>
          </div>
        ) : (
          <p className="mt-3 text-sm leading-7">{story?.note}</p>
        )}
        <p className="mt-2">
          <Link href="/capitals" className="text-sm text-laurel underline">
            수도 이야기 목록
          </Link>
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl">국기</h2>
        <p className="mt-3 text-sm leading-7">{flag?.text}</p>
        {flag?.year ? <p className="mt-1 text-xs text-muted">도안·제정: {flag.year}</p> : null}
      </section>

      <section className="mt-8 text-sm leading-7">
        <h2 className="font-serif text-2xl">언어 · 종교 · 시차</h2>
        <p className="mt-3">언어: {country.languages.map((language) => `${language.ko} (${language.en})`).join(", ")}</p>
        {country.languageNote ? <p className="text-xs text-muted">{country.languageNote}</p> : null}
        <p className="mt-2">
          종교:{" "}
          {visibleReligions(country).length
            ? visibleReligions(country).map((item) => `${item.ko} ${item.pct}%`).join(" · ")
            : "이 전망 자료에 없음"}
          . 1.0으로만 적힌 항목은 원자료에서 1% 미만이었을 수 있어 빼 두었습니다.
        </p>
        <ul className="mt-2 space-y-1">
          {zones.map((zone) => (
            <li key={zone.label}>
              {zone.label} · {zone.diffStd}
              {zone.diffDst ? ` · 서머타임이면 ${zone.diffDst}` : ""} · {zone.names.slice(0, 4).join(", ")}
              {zone.names.length > 4 ? ` 외 ${zone.names.length - 4}` : ""}
            </li>
          ))}
        </ul>
        {country.tzNote ? <p className="mt-1 text-xs text-muted">{country.tzNote}</p> : null}
        {neighborNames(country).length ? <p className="mt-2">육상 이웃(자료): {neighborNames(country).join(", ")}</p> : null}
      </section>

      {learn.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">이 나라 말 배우기</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {learn.map((item) => (
              <li key={item.code}>
                <a href={learnHref(item.code)} className="text-laurel underline" target="_blank" rel="noopener noreferrer">
                  나두랭귀지 · {item.ko}
                </a>
                <a href={carouselHref(item.code)} className="ml-3 text-muted underline" target="_blank" rel="noopener noreferrer">
                  카드뉴스
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {links.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">이어 보기</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-laurel underline" target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
                {link.note ? <span className="ml-2 text-xs text-muted">{link.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {country.films.length ? (
        <section className="mt-8">
          <h2 className="font-serif text-2xl">연표의 영화</h2>
          <p className="mt-2 text-xs text-muted">
            <a href={`${TIMELINE_URL}/movies`} className="underline" target="_blank" rel="noopener noreferrer">
              나두연표 영화
            </a>
            의 레인과 겹치는 작품만 적습니다. 그 나라에서 찍혔다는 뜻은 아닙니다.
          </p>
          <ul className="mt-2 space-y-1 text-sm">
            {country.films.map((film) => (
              <li key={film.id}>
                {film.koTitle} <span className="text-muted">({film.year}, {film.type})</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8 text-xs leading-5 text-muted" id="fn">
        <p>{country.populationNote}</p>
        <p className="mt-1">면적·언어·통화·전화는 mledoze/countries. 수도 좌표와 한국어 수도 이름은 위키데이터. 종교는 퓨 리서치 2015년 전망의 2020년 반올림 값. 시차는 IANA 시간대 파일.</p>
        <p className="mt-2">
          <Link href="/sources" className="underline">
            출처 모아 보기
          </Link>
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-line bg-card p-3">
      <dt className="text-[11px] tracking-wide text-terra">{label}</dt>
      <dd className="mt-1">{value}</dd>
    </div>
  );
}
