"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "nadoo-world-visit-day";
const NAMESPACE = "nadoo-world";
const KEY = "visits";

const PROD_HOSTS = ["nadoo-world.vercel.app"];

function isTestTraffic() {
  if (typeof window === "undefined") return true;
  if (navigator.webdriver) return true;
  if (/headless|bot|crawler|spider|lighthouse/i.test(navigator.userAgent)) return true;
  return !PROD_HOSTS.includes(window.location.hostname);
}

export function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");
    const last = localStorage.getItem(STORAGE_KEY);
    const skip = isTestTraffic();
    const path = last === today || skip ? "get" : "hit";

    fetch(`https://abacus.jasoncameron.dev/${path}/${NAMESPACE}/${KEY}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: { value?: number }) => {
        if (typeof data.value === "number") setCount(data.value);
        if (last !== today && !skip) localStorage.setItem(STORAGE_KEY, today);
      })
      .catch(() => {
        /* counter is decorative */
      });
  }, []);

  if (count === null) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted" aria-label="방문자">
        👁
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted tabular-nums" aria-label={`방문자 ${count.toLocaleString("ko-KR")}명`}>
      <span aria-hidden>👁</span>
      {count.toLocaleString("ko-KR")}
    </span>
  );
}
