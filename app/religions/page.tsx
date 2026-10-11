import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import { countries, visibleReligions } from "@/lib/countries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "종교",
  description: "퓨 리서치 센터 2015년 전망의 2020년 종교 구성. 대략적인 비율입니다.",
  path: "/religions",
});

export default function ReligionsPage() {
  const groups = ["기독교", "이슬람", "힌두교", "불교", "유대교", "민속 종교", "무종교", "그 밖의 종교"];
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead
        kicker="RELIGIONS"
        title="종교"
        lead="2015년 퓨 리서치 센터 전망의 2020년 값입니다. 조사로 센 확정 인구가 아니고, 1% 미만은 자료에서 1.0으로 바뀌어 있어 그 칸은 나라 카드에서 빼 두었습니다."
      />
      {groups.map((name) => {
        const rows = countries
          .map((country) => ({ country, item: visibleReligions(country).find((religion) => religion.ko === name) }))
          .filter((row): row is { country: (typeof countries)[number]; item: NonNullable<typeof row.item> } => Boolean(row.item))
          .sort((a, b) => b.item.pct - a.item.pct);
        if (!rows.length) return null;
        return (
          <section key={name} className="mt-8">
            <h2 className="font-serif text-2xl">{name}</h2>
            <ul className="mt-2 space-y-1 text-sm">
              {rows.map(({ country, item }) => (
                <li key={country.iso2}>
                  <Link href={`/countries/${country.iso2.toLowerCase()}`} className="underline">
                    {country.nameKo}
                  </Link>
                  <span className="ml-2 text-muted">{item.pct}%</span>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
