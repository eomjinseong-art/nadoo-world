import Link from "next/link";
import { CoupangBanner } from "@/components/CoupangBanner";
import { HomeExplorer } from "@/components/HomeExplorer";
import { JsonLd } from "@/components/JsonLd";
import { SisterSites } from "@/components/SisterSites";
import { countries } from "@/lib/countries";
import { jsonLd, pageMetadata, websiteLd } from "@/lib/seo";
import { BRAND_LINE, HOME_SECTIONS, SITE_SUB, SITE_TAGLINE } from "@/lib/site";

export const metadata = pageMetadata({
  title: "홈",
  description: `${SITE_TAGLINE}. ${SITE_SUB}`,
  path: "/",
});

export default function Home() {
  const detailedHint = "수도 이야기는 자주 공부하는 나라부터 길게 적었습니다.";
  return (
    <div className="mx-auto max-w-6xl px-4 pb-8">
      <JsonLd data={jsonLd([websiteLd(`${SITE_TAGLINE}. ${SITE_SUB}`)])} />
      <section className="py-10 text-center sm:py-14">
        <p className="text-xs tracking-[0.3em] text-terra">NADOO WORLD</p>
        <h1 className="mt-3 font-serif text-4xl text-ink sm:text-5xl">나두세계</h1>
        <p className="mt-4 text-lg text-muted">{SITE_TAGLINE}</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted">{SITE_SUB}</p>
        <p className="mt-3 text-xs text-terra">{BRAND_LINE}</p>
        <p className="mx-auto mt-4 max-w-xl text-xs leading-6 text-muted">카드 {countries.length}장. 유엔 회원국 193과 바티칸·팔레스타인·대만·코소보. {detailedHint}</p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm">
          <Link href="/quiz" className="rounded-full bg-terra px-4 py-2 text-white hover:bg-terra-deep">
            퀴즈 바로 풀기
          </Link>
          <Link href="/countries" className="rounded-full border border-line bg-card px-4 py-2 hover:border-terra">
            나라 목록
          </Link>
        </div>
      </section>
      <div className="dentil opacity-50" aria-hidden />
      <section className="mt-8" aria-labelledby="map-heading">
        <h2 id="map-heading" className="font-serif text-2xl">
          지도에서 고르기
        </h2>
        <div className="mt-4">
          <HomeExplorer />
        </div>
      </section>
      <section className="mt-12">
        <h2 className="font-serif text-2xl">공부 길</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {HOME_SECTIONS.map((section, index) => (
            <Link key={section.href} href={section.href} className="rounded-lg border border-line bg-card p-5 hover:border-terra">
              <p className="font-serif text-xs text-terra">
                {String(index + 1).padStart(2, "0")} · {section.en}
              </p>
              <h3 className="mt-1 font-serif text-xl">{section.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{section.desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl">처음 보는 순서</h2>
          <ol className="mt-4 space-y-2 text-sm">
            {[
              ["/countries/kr", "대한민국 카드로 숫자 읽는 법"],
              ["/capitals", "수도가 옮겨진 이야기"],
              ["/flags/lookalikes", "닮은 국기부터"],
              ["/rankings", "한반도와 비슷한 크기"],
              ["/quiz", "10문제"],
            ].map(([href, label], index) => (
              <li key={href}>
                <Link href={href} className="text-laurel underline">
                  {index + 1}. {label}
                </Link>
              </li>
            ))}
          </ol>
        </div>
        <SisterSites variant="home" />
      </section>
      <CoupangBanner copy="지구본을 돌리기 전에 목베개와 어댑터부터 · 쿠팡에서 세계여행 준비물 보기" />
    </div>
  );
}
