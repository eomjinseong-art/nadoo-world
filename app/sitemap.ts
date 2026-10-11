import type { MetadataRoute } from "next";
import { countries } from "@/lib/countries";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/countries",
    "/rankings",
    "/compare",
    "/flags",
    "/flags/lookalikes",
    "/languages",
    "/religions",
    "/capitals",
    "/quiz",
    "/sources",
    ...countries.map((country) => `/countries/${country.iso2.toLowerCase()}`),
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path}` }));
}
