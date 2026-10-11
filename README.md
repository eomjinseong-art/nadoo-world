# nadoo-world

나두세계 - 지도·수도·국기로 배우는 세계 상식.

한국 표준시 기준으로 오늘의 나라와 오늘의 퀴즈가 바뀝니다. 숫자의 출처와 연도는 [/sources](https://nadoo-world.vercel.app/sources)에 적습니다.

```bash
npm install
npm run typecheck
npm run build
```

나라·지도 JSON을 다시 만들 때 `npm run data` 다음에 `python3 scripts/emit_stories.py`, `python3 scripts/emit_flags.py`, `python3 scripts/emit_trivia.py`를 실행합니다.
