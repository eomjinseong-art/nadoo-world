import { SISTER_SITES, SISTER_SITES_LABEL } from "@/lib/site";

const external = "noopener noreferrer";

export function SisterSites({ variant = "header" }: { variant?: "header" | "footer" | "home" }) {
  if (variant === "footer") {
    return (
      <nav aria-label={SISTER_SITES_LABEL} className="mt-6 border-t border-line pt-4">
        <p aria-hidden className="text-[10px] tracking-[0.16em] text-terra">
          {SISTER_SITES_LABEL}
        </p>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs">
          {SISTER_SITES.map((site) => (
            <li key={site.href}>
              {"current" in site && site.current ? (
                <span aria-current="page">{site.label}</span>
              ) : (
                <a href={site.href} className="underline decoration-line underline-offset-4 hover:text-terra" target="_blank" rel={external}>
                  {site.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  if (variant === "home") {
    return (
      <section aria-labelledby="sister-sites-heading" className="rounded-lg border border-line bg-card p-5">
        <h2 id="sister-sites-heading" className="font-serif text-2xl text-ink">
          {SISTER_SITES_LABEL}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          신화와 고대 이야기, 한국사, 연표는 나두의 다른 사이트에 있습니다. 나두세계는 지금 나라의 수도·국기·순위를 적습니다.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {SISTER_SITES.map((site) => (
            <li key={site.href}>
              {"current" in site && site.current ? (
                <span className="font-medium text-ink" aria-current="page">
                  {site.label}
                </span>
              ) : (
                <a href={site.href} className="text-laurel underline decoration-line underline-offset-4 hover:text-terra" target="_blank" rel={external}>
                  {site.label}
                </a>
              )}
              <span className="ml-2 text-[11px] tracking-[0.12em] text-terra">{site.en}</span>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <nav aria-label={SISTER_SITES_LABEL} className="mx-auto flex w-full min-w-0 max-w-6xl items-center gap-x-3 overflow-x-auto px-4 pb-2.5 text-xs">
      <span aria-hidden className="sticky left-0 z-10 flex shrink-0 items-center self-stretch bg-bg pr-2 text-[10px] tracking-[0.16em] text-terra">
        {SISTER_SITES_LABEL}
      </span>
      <ul className="flex shrink-0 items-center gap-x-3">
        {SISTER_SITES.map((site) => (
          <li key={site.href} className="shrink-0">
            {"current" in site && site.current ? (
              <span className="text-ink" aria-current="page">
                {site.label}
              </span>
            ) : (
              <a href={site.href} className="text-muted underline decoration-line underline-offset-4 hover:text-terra" target="_blank" rel={external}>
                {site.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
