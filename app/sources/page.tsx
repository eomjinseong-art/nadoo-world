import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageHead } from "@/components/PageHead";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "출처",
  description: "나두세계가 숫자를 가져온 공개 자료와 라이선스, 받지 않은 항목.",
  path: "/sources",
});

export default function SourcesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { label: "출처" }]} />
      <PageHead kicker="SOURCES" title="출처" lead="2026-10-11에 받아 사이트에 넣어 둔 자료입니다. 페이지를 열 때 바깥 API를 부르지 않습니다. 없는 숫자는 만들지 않았습니다." />
      <section className="mt-8 space-y-4 text-sm leading-7">
        <h2 className="font-serif text-xl">나라의 뼈대</h2>
        <p>
          이름, ISO, 대륙, 면적(km²), 언어, 통화, 전화 코드, 내륙국 여부는{" "}
          <a className="underline" href="https://github.com/mledoze/countries" target="_blank" rel="noopener noreferrer">
            mledoze/countries
          </a>{" "}
          (ODbL)입니다. 바티칸은 그 자료에서 유엔 회원으로 표시되어 있으나, 실제로는 옵서버라 이 사이트는 회원국 193에서 빼 두었습니다. 도미니카 연방의 한국어 이름은 자료의 오기를 고쳐 ‘도미니카 연방’으로 적었습니다.
        </p>
        <h2 className="font-serif text-xl">인구</h2>
        <p>
          순위용 인구는 세계은행 지표 SP.POP.TOTL의 2025년 값입니다. 라이선스는 CC BY 4.0입니다. 중간 연도 추계가 섞일 수 있습니다. 코소보는 세계은행 코드 XKX로 붙였습니다. 대만과 바티칸은 이 지표에 없어 위키데이터 P1082를 따로 적고 순위에서는 뺐습니다. 대만 23,262,544(2026-04-01), 바티칸 882(2024-12-31). 바티칸은 시민과 거주자를 어떻게 세는지에 따라 다른 숫자가 같이 있습니다.
        </p>
        <h2 className="font-serif text-xl">수도 좌표</h2>
        <p>
          수도의 한국어 이름과 좌표는 위키데이터(CC0)의 수도(P36)와 좌표(P625)입니다. 헤이그, 푸트라자야, 코토누, 아비장은 정부 소재지라 카드에 역할을 달아 추가했습니다. 밀도는 인구÷면적으로 이 사이트에서 계산했습니다.
        </p>
        <h2 className="font-serif text-xl">종교</h2>
        <p>
          Pew Research Center, The Future of World Religions: Population Growth Projections, 2010–2050 (2015). datahub의 rounded_percentage.csv (CC BY 4.0)에서 2020년 행을 썼습니다. 원문의 1% 미만은 기술적인 이유로 1.0이 되어 있어, 1.0인 칸은 ‘약 1% 이하일 수 있음’으로 보고 나라 카드의 주요 비율에서는 빼 두었습니다. 2025년에 나온 2010–2020 추계 자료와는 다른 숫자입니다.
        </p>
        <h2 className="font-serif text-xl">시간대</h2>
        <p>
          IANA 시간대와 표준시·서머타임 오프셋은 countries-and-timezones 데이터입니다. 한국은 UTC+9로 두고 차이를 계산했습니다. 프랑스 본토 코드에는 해외 영토 시간대가 들어 있지 않습니다. 해외 영토까지 세면 12개라는 소개가 널리 쓰입니다. 러시아의 표준시 오프셋은 이 파일에서 11개입니다. 코소보(XK)는 파일에 없어 중앙유럽 표준시로 적었습니다.
        </p>
        <h2 className="font-serif text-xl">지도와 국기</h2>
        <p>
          지도는 world-atlas 2.0.2의 countries-50m TopoJSON입니다. 바탕은 퍼블릭 도메인인 내추럴 어스입니다. 남극 대륙은 화면에서 빼 두었습니다. 서사하라, 소말릴란드, 북키프로스, 시아첸은 중립 스타일이고 나라 카드가 없습니다. 국기 SVG는 flag-icons 7.5.0 (MIT)을 저장소에 복사했습니다. 시리아 깃발은 이 판의 초록·하양·검에 붉은 별 셋입니다.
        </p>
        <h2 className="font-serif text-xl">글</h2>
        <p>
          수도 이야기, 국기 풀이, 상식 문항은 이 사이트가 공개 사실로 짧게 다시 쓴 것입니다. 책이나 백과 문장을 그대로 옮기지 않았습니다. 제정 연도를 확신하지 못하면 연도를 비웠습니다. 영화 목록은 나두연표의 films.json에서 레인이 맞는 것만 붙였습니다.
        </p>
        <h2 className="font-serif text-xl">단정하지 않은 것</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>분쟁 지역의 주권과 국경. 지도는 학습용 참고입니다.</li>
          <li>인도네시아의 수도. 2026년에도 대통령령 전까지 자카르타가 수도라는 헌법재판소 정리가 있습니다. 누산타라는 건설 중인 예정 수도로만 적습니다.</li>
          <li>적도 기니. 위키데이터는 시우다드 데 라 파스(오얄라)를, mledoze는 말라보를 수도로 적습니다. 카드는 말라보를 정부가 있는 수도로, 오얄라를 지정된 새 수도로 나누고 이전이 끝났다고 쓰지 않습니다.</li>
          <li>짐바브웨 통화. 자료의 목록과 2024년 짐바브웨 골드 도입이 어긋납니다.</li>
          <li>중국의 공식 표준시는 하나(UTC+8)입니다. IANA의 신장 시간대는 같이 보여 주되 공식 시간으로 세지 않습니다.</li>
          <li>종교 비율, 특히 조사가 어려운 나라.</li>
        </ul>
      </section>
    </div>
  );
}
