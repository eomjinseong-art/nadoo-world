import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoNaturalEarth1, geoPath } from "d3-geo";

const countries = JSON.parse(readFileSync("data/countries.json", "utf8")).countries;
const topo = JSON.parse(readFileSync("data/raw/countries-50m.json", "utf8"));
const byCcn3 = new Map(countries.filter((c) => c.ccn3).map((c) => [c.ccn3.padStart(3, "0"), c]));
const byName = new Map([["Kosovo", countries.find((c) => c.iso2 === "XK")]]);

const DISPUTED_NAMES = new Set(["Somaliland", "N. Cyprus", "Siachen Glacier"]);
const DISPUTED_IDS = new Set(["732"]);

const collection = feature(topo, topo.objects.countries);
collection.features = collection.features.filter((item) => String(item.id ?? "").padStart(3, "0") !== "010");

const width = 960;
const height = 500;
const projection = geoNaturalEarth1().fitSize([width, height], collection);
const path = geoPath(projection);
path.digits(1);

const features = [];
for (const item of collection.features) {
  const id = item.id == null ? "" : String(item.id).padStart(3, "0");
  const name = item.properties?.name || "";
  const country = byCcn3.get(id) || byName.get(name) || null;
  const d = path(item);
  if (!d) continue;
  const [[x0, y0], [x1, y1]] = path.bounds(item);
  let kind = "other";
  if (country) kind = "country";
  else if (DISPUTED_NAMES.has(name) || DISPUTED_IDS.has(id)) kind = "disputed";
  features.push({
    iso: country?.iso2 ?? null,
    name: country?.nameKo ?? name,
    kind,
    region: country?.region ?? null,
    d,
    bbox: [round(x0), round(y0), round(x1), round(y1)],
  });
}

const capitals = [];
for (const country of countries) {
  for (const capital of country.capitals) {
    const point = projection([capital.lon, capital.lat]);
    if (!point || Number.isNaN(point[0]) || Number.isNaN(point[1])) continue;
    capitals.push({
      iso: country.iso2,
      name: capital.ko,
      role: capital.role,
      region: country.region,
      x: round(point[0]),
      y: round(point[1]),
    });
  }
}

const payload = { width, height, features, capitals };
writeFileSync("data/map.json", JSON.stringify(payload));
const matched = new Set(features.filter((item) => item.iso).map((item) => item.iso));
const missing = countries.filter((country) => !matched.has(country.iso2)).map((country) => country.iso2);
console.log(`features ${features.length} capitals ${capitals.length} missing shapes ${missing.join(",")}`);

function round(value) {
  return Math.round(value * 10) / 10;
}
