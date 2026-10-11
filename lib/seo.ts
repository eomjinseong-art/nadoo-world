import type { Metadata } from "next";
import { SITE_NAME, SITE_NAME_EN, SITE_URL } from "@/lib/site";

export const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "나두세계 · 지도·수도·국기",
} as const;

export function canonicalUrl(path: string) {
  if (!path || path === "/") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function clip(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).trim()}…`;
}

export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const isHome = path === "/" || path === "";
  const documentTitle = isHome ? `${SITE_NAME} · 지도·수도·국기` : `${title} · ${SITE_NAME}`;
  const url = canonicalUrl(path);
  const text = clip(description);
  return {
    title: isHome ? { absolute: documentTitle } : title,
    description: text,
    alternates: { canonical: url },
    openGraph: {
      type,
      locale: "ko_KR",
      url,
      siteName: SITE_NAME,
      title: documentTitle,
      description: text,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: documentTitle,
      description: text,
      images: [OG_IMAGE.url],
    },
  };
}

type Crumb = { name: string; path: string };

export function breadcrumbLd(items: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function itemListLd(name: string, path: string, items: { name: string; path: string }[]) {
  return {
    "@type": "ItemList",
    name,
    url: canonicalUrl(path),
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: canonicalUrl(item.path),
    })),
  };
}

export function articleLd({ headline, description, path }: { headline: string; description: string; path: string }) {
  return {
    "@type": "Article",
    headline,
    description: clip(description, 200),
    inLanguage: "ko",
    url: canonicalUrl(path),
    mainEntityOfPage: canonicalUrl(path),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

export function websiteLd(description: string) {
  return {
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [SITE_NAME_EN, "나두 세계", "Nadoo World"],
    url: canonicalUrl("/"),
    inLanguage: "ko",
    description,
  };
}

export function jsonLd(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
