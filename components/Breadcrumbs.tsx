import Link from "next/link";

export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="경로" className="mb-4 text-xs text-muted">
      <ol className="flex flex-wrap gap-x-2 gap-y-1">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {index > 0 ? <span aria-hidden>/</span> : null}
            {item.href ? (
              <Link href={item.href} className="underline decoration-line underline-offset-4 hover:text-terra">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
