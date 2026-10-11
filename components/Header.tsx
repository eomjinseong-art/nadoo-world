"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SisterSites } from "@/components/SisterSites";
import { VisitorCounter } from "@/components/VisitorCounter";
import { NAV, SITE_MARK, SITE_NAME, SITE_NAME_EN } from "@/lib/site";

function active(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2" aria-label={`${SITE_NAME} 홈`}>
          <span aria-hidden className="flex h-8 w-8 items-center justify-center rounded-full border border-terra bg-stone font-serif text-sm text-terra">
            {SITE_MARK}
          </span>
          <span className="min-w-0">
            <span className="block font-serif text-lg leading-tight tracking-wide text-ink">{SITE_NAME}</span>
            <span className="mt-0.5 block text-[10px] leading-none tracking-[0.18em] text-terra">{SITE_NAME_EN}</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-3">
          <VisitorCounter />
        </div>
      </div>
      <nav aria-label="주요 메뉴" className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2">
        <Link
          href="/"
          aria-current={pathname === "/" ? "page" : undefined}
          className={`shrink-0 rounded-full px-3 py-2 text-sm ${pathname === "/" ? "bg-terra/10 font-semibold text-terra" : "text-muted hover:bg-stone hover:text-ink"}`}
        >
          지도
        </Link>
        {NAV.map((item) => {
          const on = active(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={on ? "page" : undefined}
              className={`shrink-0 rounded-full px-3 py-2 text-sm ${on ? "bg-terra/10 font-semibold text-terra" : "text-muted hover:bg-stone hover:text-ink"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <SisterSites />
      <div className="dentil opacity-70" aria-hidden />
    </header>
  );
}
