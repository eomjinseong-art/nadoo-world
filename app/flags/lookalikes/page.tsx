import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Flag } from "@/components/Flag";
import { PageHead } from "@/components/PageHead";
import lookalikes from "@/data/lookalikes.json";
import { countryByIso } from "@/lib/countries";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "헷갈리는 국기",
  description: "닮은 국기 쌍과 무리. 색 순서, 문장, 비율이 어디가 다른지 짧게 적습니다.",
  path: "/flags/lookalikes",
});

export default function LookalikesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumbs items={[{ href: "/", label: "홈" }, { href: "/flags", label: "국기" }, { label: "헷갈리는 국기" }]} />
      <PageHead kicker="LOOKALIKES" title="헷갈리는 국기" lead={`${lookalikes.length}묶음. 비율과 문장이 핵심인 경우가 많습니다.`} />
      <ul className="mt-8 space-y-6">
        {lookalikes.map((group) => (
          <li key={group.id} className="rounded-lg border border-line bg-card p-4">
            <h2 className="font-serif text-xl">{group.title}</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {group.isos.map((iso) => {
                const country = countryByIso(iso);
                return (
                  <Link key={iso} href={`/countries/${iso.toLowerCase()}`} className="w-28 text-center text-xs">
                    <Flag iso={iso} title="" className="h-16 w-full rounded-sm border border-line bg-white object-contain" />
                    <span className="mt-1 block">{country?.nameKo}</span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-3 text-sm leading-7">{group.diff}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
