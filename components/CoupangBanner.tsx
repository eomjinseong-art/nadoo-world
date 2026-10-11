import { COUPANG_DISCLOSURE, COUPANG_URL } from "@/lib/site";

export function CoupangBanner({ copy = "수도는 외워도 콘센트 어댑터는 따로입니다 · 쿠팡에서 여행 준비물 보기" }: { copy?: string }) {
  return (
    <aside aria-label="광고" className="mx-auto max-w-6xl px-4 pt-8">
      <a
        href={COUPANG_URL}
        target="_blank"
        rel="sponsored noopener noreferrer nofollow"
        className="flex items-center gap-3 rounded-md border border-line bg-card px-4 py-3 text-sm text-ink transition-colors hover:border-terra hover:text-terra"
      >
        <span className="shrink-0 rounded-sm border border-line px-1.5 py-0.5 text-[10px] tracking-wider text-muted">광고</span>
        <span className="min-w-0 flex-1">{copy}</span>
        <span aria-hidden="true" className="shrink-0 text-terra">
          →
        </span>
      </a>
      <p className="mt-2 text-[11px] leading-5 text-muted">{COUPANG_DISCLOSURE}</p>
    </aside>
  );
}
