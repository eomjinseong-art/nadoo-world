export function Flag({ iso, title, className }: { iso: string; title: string; className?: string }) {
  return (
    // Flags are local SVG files. Nepal is not a rectangle, so the box uses contain.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/flags/${iso.toLowerCase()}.svg`}
      alt=""
      title={title}
      className={className ?? "h-8 w-12 rounded-sm border border-line bg-white object-contain"}
    />
  );
}
