/**
 * Trim, strip null bytes, and limit length of a string input.
 */
export function sanitizeString(input: string, maxLength = 500): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/\0/g, "")
    .trim()
    .slice(0, maxLength);
}

/**
 * Strip <script> tags and on* event handler attributes from HTML content.
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "");
}

/**
 * Allow only lowercase alphanumeric characters and hyphens in slugs.
 */
export function sanitizeSlug(input: string, maxLength = 200): string {
  if (typeof input !== "string") return "";
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, maxLength);
}
