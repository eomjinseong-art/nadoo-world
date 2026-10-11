import { PageHead } from "@/components/PageHead";
import { RankingsBoard } from "@/components/RankingsBoard";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "순위",
  description: "나라 면적, 인구, 밀도 순위와 한반도와 면적이 가까운 나라.",
  path: "/rankings",
});

export default function RankingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHead kicker="RANKINGS" title="순위" lead="넓은 곳과 빽빽한 곳, 그리고 한반도 남과 북의 면적을 더한 값과 가까운 나라." />
      <div className="mt-6">
        <RankingsBoard />
      </div>
    </div>
  );
}
