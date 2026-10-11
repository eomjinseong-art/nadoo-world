import Link from "next/link";
import { PageHead } from "@/components/PageHead";
import stories from "@/data/stories.json";
import { countries, primaryCapital } from "@/lib/countries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "수도 이야기",
  description: "수도 이름의 유래, 수도가 된 까닭, 짧은 역사. 자주 공부하는 나라는 길게 적었습니다.",
  path: "/capitals",
});

export default function CapitalsPage() {
  const detailed = countries.filter((country) => stories[country.iso2 as keyof typeof stories]?.level === "detail");
  const short = countries.filter((country) => stories[country.iso2 as keyof typeof stories]?.level !== "detail");
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead kicker="CAPITALS" title="수도 이야기" lead={`길게 적은 나라 ${detailed.length}곳, 짧은 노트 ${short.length}곳. 수도가 둘 이상이면 카드에서 역할을 나눕니다.`} />
      <section className="mt-8">
        <h2 className="font-serif text-2xl">길게</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {detailed.map((country) => (
            <li key={country.iso2}>
              <Link href={`/countries/${country.iso2.toLowerCase()}`} className="text-laurel underline">
                {country.nameKo}
              </Link>
              <span className="ml-2 text-muted">{primaryCapital(country).ko}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="font-serif text-2xl">짧게</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {short.map((country) => (
            <li key={country.iso2}>
              <Link href={`/countries/${country.iso2.toLowerCase()}`} className="underline">
                {country.nameKo}
              </Link>
              <span className="ml-2 text-muted">{stories[country.iso2 as keyof typeof stories]?.note}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
