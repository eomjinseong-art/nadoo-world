import bundle from "@/data/countries.json";

export type Country = (typeof bundle.countries)[number];
export type Capital = Country["capitals"][number];

export const countries: Country[] = bundle.countries;
export const RETRIEVED = bundle.retrieved;
export const UN_MEMBERS = bundle.unMembers;

const byIso = new Map(countries.map((country) => [country.iso2, country]));

export function countryByIso(iso: string) {
  return byIso.get(iso.toUpperCase()) ?? null;
}

export const REGIONS = ["Africa", "Americas", "Asia", "Europe", "Oceania"] as const;

export function regionKo(region: string) {
  return countries.find((country) => country.region === region)?.regionKo ?? region;
}

export function formatArea(km2: number) {
  if (km2 < 10) return `${km2.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}km²`;
  return `${Math.round(km2).toLocaleString("ko-KR")}km²`;
}

export function formatPop(value: number) {
  return `${value.toLocaleString("ko-KR")}명`;
}

export function formatDensity(value: number) {
  const digits = value >= 100 ? 0 : 1;
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: digits, minimumFractionDigits: digits })}명/km²`;
}

export function capitalLine(country: Country) {
  return country.capitals.map((capital) => `${capital.ko}(${capital.role})`).join(" · ");
}

export function primaryCapital(country: Country) {
  return country.capitals.find((capital) => capital.role === "수도") ?? country.capitals[0];
}

export function seoulDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function countryOfDay(date = new Date()) {
  const members = countries.filter((country) => country.status === "un");
  const key = seoulDate(date);
  return { key, country: members[hashString(`today:${key}`) % members.length] };
}

export function peninsulaAreaKm2() {
  const south = countryByIso("KR");
  const north = countryByIso("KP");
  return (south?.areaKm2 ?? 0) + (north?.areaKm2 ?? 0);
}

export function similarToPeninsula(limit = 8) {
  const target = peninsulaAreaKm2();
  return countries
    .filter((country) => country.iso2 !== "KR" && country.iso2 !== "KP")
    .map((country) => ({ country, gap: Math.abs(country.areaKm2 - target) / target }))
    .sort((a, b) => a.gap - b.gap)
    .slice(0, limit);
}

export function topReligion(country: Country) {
  const ranked = country.religions.filter((item) => !item.atMostOne);
  return ranked[0] ?? null;
}

export function visibleReligions(country: Country) {
  return country.religions.filter((item) => !item.atMostOne);
}

export function neighborNames(country: Country) {
  return country.borders
    .map((iso) => countryByIso(iso))
    .filter((item): item is Country => Boolean(item))
    .map((item) => item.nameKo);
}

const LEARN = [
  { en: "English", code: "en", ko: "영어" },
  { en: "Japanese", code: "ja", ko: "일본어" },
  { en: "Spanish", code: "es", ko: "스페인어" },
  { en: "Italian", code: "it", ko: "이탈리아어" },
  { en: "Russian", code: "ru", ko: "러시아어" },
  { en: "French", code: "fr", ko: "프랑스어" },
] as const;

export function learnLanguages(country: Country) {
  const names = new Set(country.languages.map((language) => language.en));
  return LEARN.filter((item) => names.has(item.en));
}

export function groupedZones(country: Country) {
  const groups = new Map<string, { label: string; diffStd: string; diffDst: string | null; names: string[] }>();
  for (const zone of country.timezones) {
    const key = `${zone.stdMin}:${zone.dstMin ?? ""}`;
    const group = groups.get(key) ?? {
      label: zone.stdLabel,
      diffStd: zone.diffStd,
      diffDst: zone.diffDst,
      names: [],
    };
    group.names.push(zone.id);
    groups.set(key, group);
  }
  return [...groups.values()];
}
