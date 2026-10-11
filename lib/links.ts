import type { Country } from "@/lib/countries";
import {
  CHOSEN_URL,
  EGYPT_URL,
  GERMANIC_URL,
  GREECE_URL,
  ILIAD_URL,
  KOREA_URL,
  LANG_CAROUSEL_URL,
  LANG_URL,
  MYTH_URL,
  PERSIA_URL,
  ROME_URL,
  TIMELINE_URL,
  VIKING_URL,
} from "@/lib/site";

export type OutLink = { href: string; label: string; note?: string };

const VIKING: OutLink = { href: VIKING_URL, label: "바이킹이야기" };
const GERMANIC: OutLink = { href: GERMANIC_URL, label: "게르만이야기" };
const FRANKS: OutLink = { href: `${GERMANIC_URL}/kingdoms/franks`, label: "게르만이야기 · 프랑크" };

const BY_ISO: Record<string, OutLink[]> = {
  IT: [
    { href: ROME_URL, label: "로마이야기" },
    { href: `${ROME_URL}/map`, label: "로마 지도" },
    { href: MYTH_URL, label: "나두신화" },
  ],
  VA: [
    { href: `${ROME_URL}/map`, label: "로마이야기 지도" },
    { href: MYTH_URL, label: "나두신화" },
  ],
  GR: [
    { href: GREECE_URL, label: "그리스이야기" },
    { href: `${GREECE_URL}/polis/athens`, label: "아테네" },
    { href: MYTH_URL, label: "나두신화" },
    { href: ILIAD_URL, label: "일리아스이야기" },
  ],
  TR: [
    { href: ILIAD_URL, label: "일리아스이야기" },
    { href: `${ILIAD_URL}/timeline`, label: "트로이 전쟁 연표" },
  ],
  EG: [
    { href: EGYPT_URL, label: "이집트이야기" },
    { href: `${EGYPT_URL}/map`, label: "이집트 지도" },
  ],
  IR: [
    { href: PERSIA_URL, label: "페르시아이야기" },
    { href: `${PERSIA_URL}/places`, label: "페르시아 장소" },
  ],
  DE: [GERMANIC, FRANKS],
  AT: [GERMANIC, FRANKS],
  NL: [GERMANIC, FRANKS],
  BE: [GERMANIC, FRANKS],
  LU: [GERMANIC, FRANKS],
  CH: [GERMANIC],
  LI: [GERMANIC],
  NO: [VIKING],
  DK: [VIKING],
  SE: [VIKING],
  IS: [VIKING, { href: `${VIKING_URL}/chronicle/iceland-greenland`, label: "바이킹이야기 · 아이슬란드와 그린란드" }],
  IL: [
    { href: CHOSEN_URL, label: "더 초즌 · 성경" },
    { href: `${CHOSEN_URL}/map`, label: "더 초즌 지도" },
  ],
  KR: [
    { href: KOREA_URL, label: "대한민국이야기" },
    { href: `${KOREA_URL}/palaces`, label: "궁궐" },
  ],
};

export function sisterLinks(country: Country): OutLink[] {
  const links = [...(BY_ISO[country.iso2] ?? [])];
  if (country.films.length) {
    links.push({ href: `${TIMELINE_URL}/movies`, label: "나두연표 · 영화" });
  }
  return links;
}

export function learnHref(code: string) {
  return `${LANG_URL}/?lang=${code}`;
}

export function carouselHref(code: string) {
  return `${LANG_CAROUSEL_URL}/lang/${code}`;
}
