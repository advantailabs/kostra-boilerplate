function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
