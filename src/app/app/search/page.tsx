import { redirect } from 'next/navigation';

export default function SearchRedirectPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[]>;
}) {
  const params = new URLSearchParams();
  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v));
      } else if (value != null) {
        params.set(key, value);
      }
    });
  }
  const qs = params.toString();
  redirect(`/app${qs ? `?${qs}` : ''}`);
}
