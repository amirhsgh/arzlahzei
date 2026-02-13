interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "ارزلحظه‌ای",
        url: "https://arzlahzei.ir",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://arzlahzei.ir/search?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "ارزلحظه‌ای",
        url: "https://arzlahzei.ir",
        logo: "https://arzlahzei.ir/images/logo.png",
      }}
    />
  );
}

export function ProductJsonLd({
  name,
  price,
  currency = "IRR",
  url,
}: {
  name: string;
  price: number;
  currency?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        url,
        offers: {
          "@type": "Offer",
          price: price.toString(),
          priceCurrency: currency,
          availability: "https://schema.org/InStock",
        },
      }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  image,
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        url,
        datePublished,
        dateModified: dateModified || datePublished,
        image: image || "https://arzlahzei.ir/images/logo.png",
        author: {
          "@type": "Organization",
          name: "ارزلحظه‌ای",
        },
        publisher: {
          "@type": "Organization",
          name: "ارزلحظه‌ای",
          logo: {
            "@type": "ImageObject",
            url: "https://arzlahzei.ir/images/logo.png",
          },
        },
      }}
    />
  );
}

export function FAQJsonLd({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }}
    />
  );
}

export function WebApplicationJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "All",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IRR",
        },
      }}
    />
  );
}

export function CollectionPageJsonLd({
  name,
  description,
  url,
  items,
}: {
  name: string;
  description: string;
  url: string;
  items: { name: string; url: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name,
        description,
        url,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: items.length,
          itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            url: item.url,
          })),
        },
      }}
    />
  );
}

export function AboutPageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "درباره ارزلحظه‌ای",
        url: "https://arzlahzei.ir/about",
        mainEntity: {
          "@type": "Organization",
          name: "ارزلحظه‌ای",
          url: "https://arzlahzei.ir",
          description:
            "پلتفرم قیمت لحظه‌ای ارز، طلا، سکه و ارز دیجیتال",
          logo: "https://arzlahzei.ir/images/logo.png",
        },
      }}
    />
  );
}

export function FinancialProductJsonLd({
  name,
  description,
  url,
  price,
  currency = "IRR",
}: {
  name: string;
  description: string;
  url: string;
  price: number;
  currency?: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name,
    description,
    url,
    offers: {
      "@type": "Offer",
      price: price.toString(),
      priceCurrency: currency,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function ContactPageJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "تماس با ارزلحظه‌ای",
        url: "https://arzlahzei.ir/contact",
        mainEntity: {
          "@type": "Organization",
          name: "ارزلحظه‌ای",
          url: "https://arzlahzei.ir",
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: "Persian",
          },
        },
      }}
    />
  );
}
