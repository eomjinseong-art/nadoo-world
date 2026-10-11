import { CountryBrowser } from "@/components/CountryBrowser";
import { JsonLd } from "@/components/JsonLd";
import { PageHead } from "@/components/PageHead";
import { countries } from "@/lib/countries";
import { itemListLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "나라",
  description: "유엔 회원국과 옵서버·기타의 한국어 이름, 수도, 대륙을 검색합니다.",
  path: "/countries",
});

export default function CountriesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <JsonLd
        data={jsonLd([
          itemListLd(
            "나라",
            "/countries",
            countries.map((country) => ({ name: country.nameKo, path: `/countries/${country.iso2.toLowerCase()}` })),
          ),
        ])}
      />
      <PageHead kicker="COUNTRIES" title="나라" lead="이름, 수도, ISO로 찾습니다. 내륙국과 대륙, 유엔 지위로 거를 수 있습니다." />
      <div className="mt-6">
        <CountryBrowser />
      </div>
    </div>
  );
}
