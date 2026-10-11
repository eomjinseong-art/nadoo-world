import flags from "@/data/flags.json";
import lookalikes from "@/data/lookalikes.json";
import trivia from "@/data/trivia.json";
import { countries, primaryCapital, topReligion, type Country } from "@/lib/countries";

export type Difficulty = "easy" | "medium" | "hard" | "all";
export type Mode =
  | "capital-out"
  | "capital-in"
  | "flag"
  | "lookalike"
  | "map"
  | "higher-area"
  | "higher-pop"
  | "language"
  | "religion"
  | "currency"
  | "timezone"
  | "flag-meaning"
  | "ox"
  | "trivia"
  | "daily";

export type ChoiceQuestion = {
  kind: "choice";
  id: string;
  mode: string;
  difficulty: "easy" | "medium" | "hard";
  region: string;
  prompt: string;
  choices: string[];
  images?: string[];
  answer: number;
  explain: string;
};

export type MapQuestion = {
  kind: "map";
  id: string;
  mode: "map";
  difficulty: "easy" | "medium" | "hard";
  region: string;
  prompt: string;
  iso: string;
  explain: string;
};

export type QuizQuestion = ChoiceQuestion | MapQuestion;

export const MODES: { id: Mode; label: string; blurb: string }[] = [
  { id: "capital-out", label: "수도 맞히기", blurb: "나라 보고 수도" },
  { id: "capital-in", label: "수도로 나라", blurb: "수도 보고 나라" },
  { id: "flag", label: "국기 맞히기", blurb: "깃발만 보고" },
  { id: "lookalike", label: "헷갈리는 국기", blurb: "닮은 깃발 가리기" },
  { id: "map", label: "지도에서 찾기", blurb: "지도를 눌러 고르기" },
  { id: "higher-area", label: "더 큰 나라", blurb: "면적 비교" },
  { id: "higher-pop", label: "인구가 더 많은 나라", blurb: "인구 비교" },
  { id: "language", label: "언어", blurb: "공용어·주요 언어" },
  { id: "religion", label: "종교", blurb: "비중이 큰 집단" },
  { id: "currency", label: "화폐", blurb: "통화 이름" },
  { id: "timezone", label: "시차", blurb: "한국과의 표준시 차이" },
  { id: "flag-meaning", label: "국기 뜻", blurb: "색과 문양" },
  { id: "ox", label: "수도 이야기 O/X", blurb: "맞다, 아니다" },
  { id: "trivia", label: "상식", blurb: "짧은 설명과 함께" },
  { id: "daily", label: "오늘의 도전", blurb: "날짜로 고정된 10문제" },
];

const EASY = new Set(["KR", "KP", "JP", "CN", "TW", "US", "CA", "MX", "BR", "AR", "GB", "FR", "DE", "IT", "ES", "RU", "IN", "ID", "AU", "EG", "ZA", "TR", "SA", "GR", "TH", "VN", "SG", "NZ", "SE", "NO", "CH", "PL", "PT", "NL", "IE", "IL"]);

export function mulberry32(seed: number) {
  let state = seed >>> 0;
  return function rand() {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function difficultyOf(country: Country): "easy" | "medium" | "hard" {
  if (EASY.has(country.iso2)) return "easy";
  if (country.populationRank && country.populationRank <= 80) return "medium";
  return "hard";
}

function allow(country: Country, difficulty: Difficulty, region: string) {
  if (region !== "all" && country.region !== region) return false;
  const level = difficultyOf(country);
  if (difficulty === "all" || difficulty === "hard") return true;
  if (difficulty === "easy") return level === "easy";
  return level === "easy" || level === "medium";
}

function shuffle<T>(items: T[], rand: () => number) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(pool: Country[], correct: Country, rand: () => number, count = 3) {
  const same = pool.filter((item) => item.iso2 !== correct.iso2 && item.region === correct.region);
  const rest = pool.filter((item) => item.iso2 !== correct.iso2);
  const source = same.length >= count ? same : rest;
  return shuffle(source, rand).slice(0, count);
}

function choice(partial: Omit<ChoiceQuestion, "kind" | "answer" | "choices"> & { correct: string; wrong: string[] }, rand: () => number): ChoiceQuestion {
  const wrong = Array.from(new Set(partial.wrong.filter((item) => item && item !== partial.correct))).slice(0, 3);
  const choices = shuffle([partial.correct, ...wrong], rand);
  return {
    kind: "choice",
    id: partial.id,
    mode: partial.mode,
    difficulty: partial.difficulty,
    region: partial.region,
    prompt: partial.prompt,
    images: partial.images,
    choices,
    answer: choices.indexOf(partial.correct),
    explain: partial.explain,
  };
}

function capitalQuestions(mode: "capital-out" | "capital-in", pool: Country[], rand: () => number) {
  return pool.map((country) => {
    const capital = primaryCapital(country);
    const role = country.capitals.length > 1 ? capital.role : "수도";
    const wrongCountries = pickDistractors(pool, country, rand);
    if (mode === "capital-out") {
      const wrong = wrongCountries.map((item) => primaryCapital(item).ko);
      return choice(
        {
          id: `capital-out:${country.iso2}`,
          mode,
          difficulty: difficultyOf(country),
          region: country.region,
          prompt: `${country.nameKo}의 ${role}는?`,
          correct: capital.ko,
          wrong: Array.from(new Set(wrong)).filter((name) => name !== capital.ko).slice(0, 3),
          explain: `${country.nameKo}의 ${role}는 ${capital.ko}(${capital.en})입니다.`,
        },
        rand,
      );
    }
    return choice(
      {
        id: `capital-in:${country.iso2}:${capital.en}`,
        mode,
        difficulty: difficultyOf(country),
        region: country.region,
        prompt: `${capital.ko}를 ${role}로 두는 나라는?`,
        correct: country.nameKo,
        wrong: wrongCountries.map((item) => item.nameKo),
        explain: `${capital.ko}는 ${country.nameKo}의 ${role}입니다.`,
      },
      rand,
    );
  });
}

function flagQuestions(pool: Country[], rand: () => number): ChoiceQuestion[] {
  return pool.map((country) =>
    choice(
      {
        id: `flag:${country.iso2}`,
        mode: "flag",
        difficulty: difficultyOf(country),
        region: country.region,
        prompt: "이 국기는 어느 나라의 것인가요?",
        images: [`/flags/${country.iso2.toLowerCase()}.svg`],
        correct: country.nameKo,
        wrong: pickDistractors(pool, country, rand).map((item) => item.nameKo),
        explain: `${country.nameKo}(${country.nameEn})의 국기입니다.`,
      },
      rand,
    ),
  );
}

function lookalikeQuestions(region: string, rand: () => number): ChoiceQuestion[] {
  return lookalikes
    .map((group): ChoiceQuestion | null => {
      const members = group.isos.map((iso) => countries.find((country) => country.iso2 === iso)).filter((item): item is Country => Boolean(item));
      if (members.length < 2) return null;
      if (region !== "all" && !members.some((item) => item.region === region)) return null;
      const correct = members.map((item) => item.nameKo).join(" · ");
      const choices = shuffle([correct, ...group.decoys], rand);
      return {
        kind: "choice" as const,
        id: `look:${group.id}`,
        mode: "lookalike",
        difficulty: "hard" as const,
        region: members[0].region,
        prompt: `${group.title}. 깃발은 왼쪽부터입니다. 순서는?`,
        images: members.map((item) => `/flags/${item.iso2.toLowerCase()}.svg`),
        choices,
        answer: choices.indexOf(correct),
        explain: group.diff,
      };
    })
    .filter((item): item is ChoiceQuestion => Boolean(item));
}

function mapQuestions(pool: Country[]): MapQuestion[] {
  return pool.map((country) => ({
    kind: "map",
    id: `map:${country.iso2}`,
    mode: "map",
    difficulty: difficultyOf(country),
    region: country.region,
    prompt: `지도에서 ${country.nameKo}를 누르세요.`,
    iso: country.iso2,
    explain: `${country.nameKo}는 ${country.regionKo}에 있습니다. 수도는 ${primaryCapital(country).ko}입니다.`,
  }));
}

function higherQuestions(metric: "area" | "population", pool: Country[], rand: () => number): ChoiceQuestion[] {
  const source = pool.filter((country) => (metric === "area" ? country.areaKm2 > 0 : country.populationRanked && country.population));
  const questions: ChoiceQuestion[] = [];
  const used = new Set<string>();
  for (const country of source) {
    const other = shuffle(
      source.filter((item) => item.iso2 !== country.iso2),
      rand,
    ).find((item) => {
      const av = metric === "area" ? country.areaKm2 : country.population || 0;
      const bv = metric === "area" ? item.areaKm2 : item.population || 0;
      return av !== bv && !used.has([country.iso2, item.iso2].sort().join());
    });
    if (!other) continue;
    used.add([country.iso2, other.iso2].sort().join());
    const av = metric === "area" ? country.areaKm2 : country.population || 0;
    const bv = metric === "area" ? other.areaKm2 : other.population || 0;
    const winner = av > bv ? country : other;
    const loser = winner === country ? other : country;
    questions.push({
      kind: "choice",
      id: `higher-${metric}:${[country.iso2, other.iso2].sort().join("-")}`,
      mode: metric === "area" ? "higher-area" : "higher-pop",
      difficulty: difficultyOf(winner) === "hard" || difficultyOf(loser) === "hard" ? "hard" : "medium",
      region: winner.region,
      prompt: metric === "area" ? "면적이 더 넓은 나라는?" : "인구가 더 많은 나라는? (세계은행 2025)",
      choices: [country.nameKo, other.nameKo],
      answer: winner === country ? 0 : 1,
      explain: `${winner.nameKo}가 ${loser.nameKo}보다 ${metric === "area" ? "넓습니다" : "인구가 많습니다"}.`,
    });
  }
  return questions;
}

function languageQuestions(pool: Country[], rand: () => number): ChoiceQuestion[] {
  const langs = Array.from(new Set(countries.flatMap((country) => country.languages.map((language) => language.ko))));
  return pool
    .filter((country) => country.languages.length)
    .map((country) => {
      const correct = country.languages[0].ko;
      const wrong = shuffle(
        langs.filter((name) => !country.languages.some((language) => language.ko === name)),
        rand,
      ).slice(0, 3);
      return choice(
        {
          id: `lang:${country.iso2}`,
          mode: "language",
          difficulty: difficultyOf(country),
          region: country.region,
          prompt: `${country.nameKo}의 자료상 언어에 들어가는 것은?`,
          correct,
          wrong,
          explain: `${country.nameKo}: ${country.languages.map((language) => language.ko).join(", ")}. ${country.languageNote ?? "mledoze/countries에 올라 있는 이름입니다."}`,
        },
        rand,
      );
    });
}

function religionQuestions(pool: Country[], rand: () => number): ChoiceQuestion[] {
  const labels = ["기독교", "이슬람", "힌두교", "불교", "유대교", "무종교", "민속 종교"];
  return pool.flatMap((country) => {
    const top = topReligion(country);
    const second = country.religions.filter((item) => !item.atMostOne)[1];
    if (!top || top.pct < 40) return [];
    if (second && top.pct - second.pct < 15) return [];
    const wrong = labels.filter((name) => name !== top.ko).slice(0, 3);
    return [
      choice(
        {
          id: `rel:${country.iso2}`,
          mode: "religion",
          difficulty: difficultyOf(country),
          region: country.region,
          prompt: `${country.nameKo}에서 2020년 전망치 비중이 가장 큰 집단은?`,
          correct: top.ko,
          wrong,
          explain: `${top.ko} ${top.pct}%. 퓨 리서치 2015년 전망의 2020년 값이고, 1% 미만은 자료에서 1.0으로 바뀌어 있습니다.`,
        },
        rand,
      ),
    ];
  });
}

function currencyQuestions(pool: Country[], rand: () => number): ChoiceQuestion[] {
  const names = Array.from(new Set(countries.flatMap((country) => country.currencies.map((item) => item.ko))));
  return pool
    .filter((country) => country.currencies.length === 1 && !country.currencyNote)
    .map((country) => {
      const correct = `${country.currencies[0].ko} (${country.currencies[0].code})`;
      const wrong = shuffle(
        names.filter((name) => name !== country.currencies[0].ko),
        rand,
      )
        .slice(0, 3)
        .map((name) => name);
      return choice(
        {
          id: `cur:${country.iso2}`,
          mode: "currency",
          difficulty: difficultyOf(country),
          region: country.region,
          prompt: `${country.nameKo}의 통화는?`,
          correct,
          wrong,
          explain: `${country.nameKo}의 자료상 통화는 ${correct}입니다.`,
        },
        rand,
      );
    });
}

function timezoneQuestions(pool: Country[], rand: () => number): ChoiceQuestion[] {
  const diffs = ["한국과 같습니다", "한국보다 1시간 느립니다", "한국보다 8시간 느립니다", "한국보다 9시간 느립니다", "한국보다 1시간 빠릅니다", "한국보다 2시간 빠릅니다", "한국보다 3시간 느립니다", "한국보다 6시간 느립니다", "한국보다 7시간 느립니다"];
  return pool
    .filter((country) => new Set(country.timezones.map((zone) => zone.stdMin)).size === 1)
    .map((country) => {
      const correct = country.timezones[0].diffStd;
      const wrong = shuffle(
        diffs.filter((item) => item !== correct),
        rand,
      ).slice(0, 3);
      return choice(
        {
          id: `tz:${country.iso2}`,
          mode: "timezone",
          difficulty: difficultyOf(country),
          region: country.region,
          prompt: `${country.nameKo}의 표준시는 한국과 얼마나 차이 나나요?`,
          correct,
          wrong,
          explain: `${country.timezones[0].stdLabel}. ${correct} 서머타임이 있으면 여름에는 달라집니다. ${country.tzNote ?? ""}`.trim(),
        },
        rand,
      );
    });
}

function bankQuestions(kind: "trivia" | "flag" | "ox", region: string, difficulty: Difficulty): ChoiceQuestion[] {
  return trivia
    .filter((item) => item.kind === kind)
    .filter((item) => region === "all" || item.region === "world" || item.region === region)
    .filter((item) => difficulty === "all" || difficulty === "hard" || item.difficulty === difficulty || (difficulty === "medium" && item.difficulty === "easy"))
    .map((item) => ({
      kind: "choice" as const,
      id: item.id,
      mode: kind === "flag" ? "flag-meaning" : kind === "ox" ? "ox" : "trivia",
      difficulty: item.difficulty as ChoiceQuestion["difficulty"],
      region: item.region,
      prompt: item.q,
      choices: item.choices,
      answer: item.answer,
      explain: item.explain,
    }));
}

export function questionPool(mode: Mode, difficulty: Difficulty, region: string, rand: () => number): QuizQuestion[] {
  const pool = countries.filter((country) => allow(country, difficulty, region));
  const wide = pool.length < 8 ? countries.filter((country) => region === "all" || country.region === region) : pool;
  if (mode === "capital-out" || mode === "capital-in") return capitalQuestions(mode, wide, rand);
  if (mode === "flag") return flagQuestions(wide, rand);
  if (mode === "lookalike") return lookalikeQuestions(region, rand);
  if (mode === "map") return mapQuestions(wide);
  if (mode === "higher-area" || mode === "higher-pop") return higherQuestions(mode === "higher-area" ? "area" : "population", wide, rand);
  if (mode === "language") return languageQuestions(wide, rand);
  if (mode === "religion") return religionQuestions(wide, rand);
  if (mode === "currency") return currencyQuestions(wide, rand);
  if (mode === "timezone") return timezoneQuestions(wide, rand);
  if (mode === "flag-meaning") return bankQuestions("flag", region, difficulty);
  if (mode === "ox") return bankQuestions("ox", region, difficulty);
  return bankQuestions("trivia", region, difficulty);
}

export function buildRound(options: { mode: Mode; difficulty: Difficulty; region: string; count?: number; seed: number }): QuizQuestion[] {
  const count = options.count ?? 10;
  const rand = mulberry32(options.seed);
  if (options.mode === "daily") {
    const mix: Mode[] = ["trivia", "capital-out", "flag", "lookalike", "higher-pop", "map", "ox", "timezone", "language", "flag-meaning"];
    const picked: QuizQuestion[] = [];
    const seen = new Set<string>();
    mix.forEach((mode, index) => {
      const pool = questionPool(mode, "all", "all", mulberry32(options.seed + index + 1));
      const item = shuffle(pool, mulberry32(options.seed + index + 99)).find((question) => !seen.has(question.id));
      if (item) {
        seen.add(item.id);
        picked.push(item);
      }
    });
    return picked.slice(0, count);
  }
  const pool = questionPool(options.mode, options.difficulty, options.region, rand);
  return shuffle(pool, rand).slice(0, Math.min(count, pool.length));
}

export function flagNote(iso: string) {
  return flags[iso as keyof typeof flags] ?? null;
}

export const TRIVIA_COUNT = trivia.filter((item) => item.kind === "trivia").length;
export const LOOKALIKE_COUNT = lookalikes.length;
