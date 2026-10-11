import { CompareTool } from "@/components/CompareTool";
import { PageHead } from "@/components/PageHead";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "비교",
  description: "두 나라의 면적, 인구, 밀도를 나란히 비교합니다.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <PageHead kicker="COMPARE" title="두 나라" lead="막대는 둘 중 큰 값을 100으로 둔 상대 비교입니다. 세계 순위와는 다릅니다." />
      <div className="mt-6">
        <CompareTool />
      </div>
    </div>
  );
}
