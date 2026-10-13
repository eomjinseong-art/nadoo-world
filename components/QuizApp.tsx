"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { WorldMap } from "@/components/WorldMap";
import { countryByIso, hashString, regionKo, seoulDate } from "@/lib/countries";
import { MODES, buildRound, type Difficulty, type Mode, type QuizQuestion } from "@/lib/quiz";
import { CoupangCard } from "@/components/CoupangCard";

const WRONGS_KEY = "nadoo-world-wrongs";
const BEST_KEY = "nadoo-world-best-streak";

type Stored = QuizQuestion & { at: string };

function readWrongs(): Stored[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(WRONGS_KEY) || "[]") as Stored[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function QuizApp() {
  const [mode, setMode] = useState<Mode>("trivia");
  const [difficulty, setDifficulty] = useState<Difficulty>("all");
  const [region, setRegion] = useState("all");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [mapIso, setMapIso] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [phase, setPhase] = useState<"menu" | "play" | "result">("menu");
  const [wrongs, setWrongs] = useState<Stored[]>([]);
  const [review, setReview] = useState(false);

  useEffect(() => {
    setWrongs(readWrongs());
    setBest(Number(localStorage.getItem(BEST_KEY) || 0));
  }, []);

  const current = questions[index];
  const today = useMemo(() => seoulDate(), []);

  function rememberBest(next: number) {
    setBest((prev) => {
      const value = Math.max(prev, next);
      localStorage.setItem(BEST_KEY, String(value));
      return value;
    });
  }

  function saveWrong(question: QuizQuestion) {
    const next = [{ ...question, at: new Date().toISOString() }, ...readWrongs().filter((item) => item.id !== question.id)].slice(0, 200);
    localStorage.setItem(WRONGS_KEY, JSON.stringify(next));
    setWrongs(next);
  }

  function dropWrong(id: string) {
    const next = readWrongs().filter((item) => item.id !== id);
    localStorage.setItem(WRONGS_KEY, JSON.stringify(next));
    setWrongs(next);
  }

  function start(nextMode: Mode, seed: number, fromReview = false) {
    const round = fromReview
      ? readWrongs().slice(0, 10)
      : buildRound({ mode: nextMode, difficulty, region, seed, count: 10 });
    if (!round.length) return;
    setMode(nextMode);
    setQuestions(round);
    setIndex(0);
    setScore(0);
    setStreak(0);
    setPicked(null);
    setMapIso(null);
    setRevealed(false);
    setReview(fromReview);
    setPhase("play");
  }

  function grade(ok: boolean) {
    if (!current || revealed) return;
    setRevealed(true);
    if (ok) {
      const next = streak + 1;
      setStreak(next);
      setScore((value) => value + 1);
      rememberBest(next);
      if (review) dropWrong(current.id);
    } else {
      setStreak(0);
      saveWrong(current);
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      setPhase("result");
      return;
    }
    setIndex((value) => value + 1);
    setPicked(null);
    setMapIso(null);
    setRevealed(false);
  }

  return (
    <div>
      {phase === "menu" ? (
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => (item.id === "daily" ? start("daily", hashString(`daily:${today}`)) : setMode(item.id))}
                className={`rounded-lg border p-4 text-left ${mode === item.id ? "border-terra bg-card" : "border-line bg-card hover:border-terra"}`}
              >
                <span className="block font-serif text-xl">{item.label}</span>
                <span className="mt-1 block text-sm text-muted">{item.blurb}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["all", "easy", "medium", "hard"] as const).map((item) => (
              <button key={item} type="button" onClick={() => setDifficulty(item)} className={`rounded-full px-3 py-1.5 text-sm ${difficulty === item ? "bg-terra text-white" : "border border-line bg-card"}`}>
                {item === "all" ? "전체" : item === "easy" ? "쉬움" : item === "medium" ? "보통" : "어려움"}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto">
            {["all", "Asia", "Europe", "Africa", "Americas", "Oceania"].map((item) => (
              <button key={item} type="button" onClick={() => setRegion(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-sm ${region === item ? "bg-laurel text-white" : "border border-line bg-card"}`}>
                {item === "all" ? "모든 대륙" : regionKo(item)}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => start(mode, hashString(`${mode}:${Date.now()}`))} className="rounded-full bg-terra px-4 py-2 text-sm text-white">
              10문제 시작
            </button>
            <button type="button" onClick={() => start("daily", hashString(`daily:${today}`))} className="rounded-full border border-terra px-4 py-2 text-sm text-terra">
              오늘의 도전
            </button>
            <button type="button" disabled={!wrongs.length} onClick={() => start(mode, 1, true)} className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40">
              오답노트 {wrongs.length} · 다시 풀기
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">최고 연속 정답 {best}. 오답은 이 브라우저에만 저장됩니다. 오늘의 도전은 한국 날짜로 고정됩니다.</p>
        </div>
      ) : null}

      {phase === "play" && current ? (
        <div>
          <p className="text-xs text-terra">
            {index + 1} / {questions.length} · 맞힌 수 {score} · 연속 {streak}
          </p>
          <h2 className="mt-2 font-serif text-2xl leading-snug">{current.prompt}</h2>
          {current.kind === "choice" && current.images?.length ? (
            <div className="mt-4 flex flex-wrap gap-3">
              {current.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" className="h-20 w-32 rounded-sm border border-line bg-white object-contain" />
              ))}
            </div>
          ) : null}
          {current.kind === "map" ? (
            <div className="mt-4">
              <WorldMap
                quiz
                selected={mapIso}
                onSelect={(iso) => {
                  if (revealed || !iso) return;
                  setMapIso(iso);
                  grade(iso === current.iso);
                }}
              />
              {revealed ? (
                <p className="mt-3 text-sm leading-6">
                  {mapIso === current.iso ? "맞았습니다." : `정답은 ${countryByIso(current.iso)?.nameKo ?? current.iso}입니다.`} {current.explain}
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted">나라를 누르면 바로 채점합니다.</p>
              )}
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {current.choices.map((choice, choiceIndex) => {
                const correct = revealed && choiceIndex === current.answer;
                const wrongPick = revealed && picked === choiceIndex && choiceIndex !== current.answer;
                return (
                  <li key={choice}>
                    <button
                      type="button"
                      disabled={revealed}
                      onClick={() => {
                        setPicked(choiceIndex);
                        grade(choiceIndex === current.answer);
                      }}
                      className={`w-full rounded-md border px-3 py-3 text-left text-sm ${correct ? "border-laurel bg-laurel/10" : wrongPick ? "border-terra bg-terra/10" : "border-line bg-card hover:border-terra"}`}
                    >
                      {choice}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {revealed && current.kind === "choice" ? <p className="mt-4 text-sm leading-7">{current.explain}</p> : null}
          {revealed ? (
            <button type="button" onClick={next} className="mt-4 rounded-full bg-terra px-4 py-2 text-sm text-white">
              {index + 1 >= questions.length ? "결과" : "다음"}
            </button>
          ) : null}
        </div>
      ) : null}

      {phase === "result" ? (
        <div className="rounded-lg border border-line bg-card p-5">
          <h2 className="font-serif text-3xl">
            {score} / {questions.length}
          </h2>
          <p className="mt-2 text-sm text-muted">이번 연속 정답은 {streak}에서 끝났고, 최고 기록은 {best}입니다.</p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button type="button" onClick={() => setPhase("menu")} className="rounded-full bg-terra px-4 py-2 text-white">
              다른 퀴즈
            </button>
            <Link href="/countries" className="rounded-full border border-line px-4 py-2">
              나라 카드
            </Link>
          </div>
          <CoupangCard />
        </div>
      ) : null}
    </div>
  );
}
