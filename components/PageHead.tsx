export function PageHead({ kicker, title, lead }: { kicker: string; title: string; lead: string }) {
  return (
    <header className="max-w-3xl">
      <p className="text-[11px] tracking-[0.16em] text-terra">{kicker}</p>
      <h1 className="mt-1 font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
      <p className="mt-3 text-sm leading-7 text-muted">{lead}</p>
    </header>
  );
}
