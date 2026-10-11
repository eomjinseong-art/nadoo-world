export const SITE_NAME = "나두세계";
export const SITE_NAME_EN = "Nadoo World";
export const SITE_MARK = "세";
export const SITE_TAGLINE = "지도·수도·국기로 세계 상식을 짧게";
export const SITE_SUB =
  "유엔 회원국 193곳과 옵서버·기타를 한국어로 잇습니다. 수도의 사연, 국기의 뜻, 순위와 퀴즈를 한곳에 두었습니다.";
export const BRAND_LINE = "나두 — 나의 모든 일상을 AI와 함께";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nadoo-world.vercel.app";

export const SISTER_SITES_LABEL = "나두 역사·신화";

export const MYTH_URL = "https://nadoo-myth.vercel.app";
export const ILIAD_URL = "https://iliad-stories.vercel.app";
export const GREECE_URL = "https://greece-stories.vercel.app";
export const ROME_URL = "https://rome-stories.vercel.app";
export const GERMANIC_URL = "https://germanic-stories.vercel.app";
export const VIKING_URL = "https://viking-stories.vercel.app";
export const EGYPT_URL = "https://egypt-stories.vercel.app";
export const PERSIA_URL = "https://persia-stories.vercel.app";
export const CHOSEN_URL = "https://the-chosen-korean.vercel.app";
export const PHILOSOPHY_URL = "https://philosophy-stories.vercel.app";
export const KOREA_URL = "https://korea-stories.vercel.app";
export const ARTS_URL = "https://nadoo-arts.vercel.app";
export const TIMELINE_URL = "https://nadoo-timeline.vercel.app";
export const HUB_URL = "https://tinalinkeom.vercel.app";
export const LANG_URL = "https://language-study-snowy.vercel.app";
export const LANG_CAROUSEL_URL = "https://nadoo-language-carousel.vercel.app";

export const SISTER_SITES = [
  { href: MYTH_URL, label: "나두신화", en: "Myth" },
  { href: ILIAD_URL, label: "일리아스이야기", en: "Iliad" },
  { href: GREECE_URL, label: "그리스이야기", en: "Greece" },
  { href: ROME_URL, label: "로마이야기", en: "Rome" },
  { href: GERMANIC_URL, label: "게르만이야기", en: "Germanic" },
  { href: VIKING_URL, label: "바이킹이야기", en: "Viking" },
  { href: EGYPT_URL, label: "이집트이야기", en: "Egypt" },
  { href: PERSIA_URL, label: "페르시아이야기", en: "Persia" },
  { href: CHOSEN_URL, label: "더 초즌 · 성경", en: "The Chosen · Bible" },
  { href: PHILOSOPHY_URL, label: "철학이야기", en: "Philosophy" },
  { href: KOREA_URL, label: "대한민국이야기", en: "Korea" },
  { href: SITE_URL, label: "나두세계", en: "World", current: true },
  { href: ARTS_URL, label: "나두예술", en: "Arts" },
  { href: TIMELINE_URL, label: "나두연표", en: "Timeline" },
  { href: HUB_URL, label: "나두 허브", en: "Nadoo Hub" },
] as const;

export const COUPANG_URL = "https://link.coupang.com/a/hsdzLh1vB6";
export const COUPANG_DISCLOSURE = "이 게시물은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.";

export const NAV = [
  { href: "/countries", label: "나라" },
  { href: "/rankings", label: "순위" },
  { href: "/compare", label: "비교" },
  { href: "/flags", label: "국기" },
  { href: "/languages", label: "언어" },
  { href: "/religions", label: "종교" },
  { href: "/capitals", label: "수도" },
  { href: "/quiz", label: "퀴즈" },
  { href: "/sources", label: "출처" },
] as const;

export const HOME_SECTIONS = [
  { href: "/countries", en: "Countries", title: "나라 카드", desc: "이름, 수도, 면적, 인구, 언어, 종교, 시차. 검색하고 대륙으로 거릅니다." },
  { href: "/capitals", en: "Capitals", title: "수도 이야기", desc: "왜 그 도시가 수도가 됐는지. 브라질리아, 캔버라, 네피도, 베른처럼 사연이 긴 곳을 앞에 둡니다." },
  { href: "/flags", en: "Flags", title: "국기와 닮은 깃발", desc: "색과 문양, 그리고 인도네시아와 모나코처럼 헷갈리는 쌍." },
  { href: "/rankings", en: "Rankings", title: "크기와 인구", desc: "넓은 나라, 빽빽한 나라, 한반도와 비슷한 크기의 나라." },
  { href: "/compare", en: "Compare", title: "둘을 나란히", desc: "면적, 인구, 밀도를 막대로 비교합니다." },
  { href: "/quiz", en: "Quiz", title: "퀴즈", desc: "수도, 국기, 지도, 시차, 상식. 10문제, 오답노트, 오늘의 도전." },
  { href: "/languages", en: "Languages", title: "언어", desc: "어느 나라에서 그 말을 쓰는지. 배우는 길은 나두랭귀지로 잇습니다." },
  { href: "/religions", en: "Religions", title: "종교", desc: "2020년 전망치입니다. 1% 미만은 1%로 바뀌어 있어 그대로 단정하지 않습니다." },
] as const;
