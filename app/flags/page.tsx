import { FlagGallery } from "@/components/FlagGallery";
import { PageHead } from "@/components/PageHead";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "국기",
  description: "대륙별 국기 갤러리. 색과 문양의 뜻은 나라 카드에 있습니다.",
  path: "/flags",
});

export default function FlagsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHead kicker="FLAGS" title="국기" lead="깃발은 flag-icons(MIT) SVG를 이 사이트에 담아 그립니다. 네팔은 사각형이 아니고, 스위스와 바티칸은 정사각형에 가깝습니다." />
      <div className="mt-6">
        <FlagGallery />
      </div>
    </div>
  );
}
