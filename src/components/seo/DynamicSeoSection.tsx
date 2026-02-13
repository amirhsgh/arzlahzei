import { Card, CardContent } from "@/components/ui/Card";

interface DynamicSeoSectionProps {
  seoText: string;
  faq: { question: string; answer: string }[];
}

export function DynamicSeoSection({ seoText, faq }: DynamicSeoSectionProps) {
  return (
    <section className="mt-8 space-y-6">
      {/* SEO Text */}
      <Card>
        <CardContent className="pt-4 sm:pt-6">
          <div className="prose prose-sm max-w-none text-muted-foreground dark:prose-invert">
            {seoText.split("\n\n").map((paragraph, i) => (
              <p key={i} className="mb-3 leading-7 text-sm">
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Accordion */}
      {faq.length > 0 && (
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <h2 className="mb-4 text-lg font-bold">سوالات متداول</h2>
            <div className="divide-y divide-border">
              {faq.map((item, i) => (
                <details key={i} className="group py-3 first:pt-0 last:pb-0">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium leading-7 transition-colors hover:text-primary">
                    {item.question}
                    <span className="mr-2 text-muted-foreground transition-transform group-open:rotate-180">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
