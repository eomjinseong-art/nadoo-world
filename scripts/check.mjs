import { readFileSync, existsSync } from "node:fs";

const countries = JSON.parse(readFileSync("data/countries.json", "utf8"));
const stories = JSON.parse(readFileSync("data/stories.json", "utf8"));
const flags = JSON.parse(readFileSync("data/flags.json", "utf8"));
const lookalikes = JSON.parse(readFileSync("data/lookalikes.json", "utf8"));
const trivia = JSON.parse(readFileSync("data/trivia.json", "utf8"));
const list = countries.countries;
const by = Object.fromEntries(list.map((country) => [country.iso2, country]));

function fail(message) {
  console.error(message);
  process.exitCode = 1;
}

if (list.length !== 197) fail(`country count ${list.length}`);
if (countries.unMembers !== 193) fail(`un ${countries.unMembers}`);
if (list.filter((country) => country.status === "un").length !== 193) fail("status un");

let detail = 0;
let short = 0;
for (const country of list) {
  const story = stories[country.iso2];
  const flag = flags[country.iso2];
  if (!story) fail(`missing story ${country.iso2}`);
  if (!flag?.text) fail(`missing flag ${country.iso2}`);
  if (!existsSync(`public/flags/${country.iso2.toLowerCase()}.svg`)) fail(`missing svg ${country.iso2}`);
  if (story?.level === "detail") {
    detail += 1;
    for (const key of ["origin", "became", "history", "anecdote"]) {
      if (!story[key] || story[key].length < 20) fail(`thin detail ${country.iso2} ${key}`);
    }
  } else if (story) {
    short += 1;
    if (!story.note || story.note.length < 20) fail(`thin short ${country.iso2}`);
  }
  if (!country.capitals?.length) fail(`no capital ${country.iso2}`);
}
if (detail < 60) fail(`detail ${detail}`);
if (short + detail !== 197) fail(`story sum ${detail}+${short}`);

if (lookalikes.length < 20) fail(`lookalikes ${lookalikes.length}`);
for (const group of lookalikes) {
  if (group.isos.length < 2) fail(`short group ${group.id}`);
  const correct = group.isos.map((iso) => by[iso]?.nameKo).join(" · ");
  if (correct.includes("undefined")) fail(`bad iso ${group.id}`);
  if (group.decoys.includes(correct)) fail(`decoy matches ${group.id}`);
  if (!group.diff || group.diff.length < 20) fail(`thin diff ${group.id}`);
}

const ids = new Set();
const kinds = {};
for (const item of trivia) {
  if (ids.has(item.id)) fail(`dup trivia ${item.id}`);
  ids.add(item.id);
  kinds[item.kind] = (kinds[item.kind] || 0) + 1;
  if (item.answer < 0 || item.answer >= item.choices.length) fail(`answer ${item.id}`);
  if (new Set(item.choices).size !== item.choices.length) fail(`choice dup ${item.id}`);
  if (!item.explain) fail(`explain ${item.id}`);
}
if ((kinds.trivia || 0) < 200) fail(`trivia ${kinds.trivia}`);
if ((kinds.flag || 0) < 30) fail(`flag q ${kinds.flag}`);
if ((kinds.ox || 0) < 30) fail(`ox ${kinds.ox}`);

const pop = [...list].filter((country) => country.populationRank).sort((a, b) => a.populationRank - b.populationRank);
const area = [...list].sort((a, b) => b.areaKm2 - a.areaKm2);
const unArea = [...list].filter((country) => country.status === "un").sort((a, b) => a.areaKm2 - b.areaKm2);
if (pop[0].iso2 !== "IN") fail("pop 1");
if (area[0].iso2 !== "RU") fail("area 1");
if (unArea[0].iso2 !== "MC") fail("smallest un");
if (area.at(-1).iso2 !== "VA") fail("smallest all");
if (by.GQ.capitals[0].en !== "Malabo") fail("gq capital");
if (by.ID.capitals.length !== 1 || by.ID.capitals[0].en !== "Jakarta") fail("jakarta");
if (by.ZA.capitals.length !== 3) fail("za capitals");

console.log(
  JSON.stringify(
    {
      countries: list.length,
      un: countries.unMembers,
      detail,
      short,
      lookalikes: lookalikes.length,
      trivia: kinds,
    },
    null,
    2,
  ),
);
if (process.exitCode) process.exit(process.exitCode);
