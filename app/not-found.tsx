import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs tracking-[0.2em] text-terra">404</p>
      <h1 className="mt-2 font-serif text-3xl text-ink">이 칸에는 나라가 없습니다</h1>
      <p className="mt-3 text-sm leading-7 text-muted">주소가 없거나 옮겨졌습니다. 지도로 돌아가 다른 나라를 고르세요.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
        <Link href="/" className="text-terra underline">
          지도
        </Link>
        <Link href="/countries" className="text-terra underline">
          나라
        </Link>
        <Link href="/quiz" className="text-terra underline">
          퀴즈
        </Link>
      </div>
    </div>
  );
}
