import type { Metadata } from "next";

const SITE_NAME = "ارزلحظه‌ای";
const SITE_URL = "https://nerkhe.ir";

export function generatePageMetadata({
  title,
  description,
  keywords,
  path = "",
  ogImage,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  ogImage?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;

  return {
    title: fullTitle,
    description,
    keywords: keywords?.join(", "),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "fa_IR",
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export { SITE_NAME, SITE_URL };
