import { permanentRedirect } from 'next/navigation';

export default function LegacyTourbillerCheckoutRedirect({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (typeof value === 'string') {
        params.set(key, value);
      } else if (Array.isArray(value) && typeof value[0] === 'string') {
        params.set(key, value[0]);
      }
    }
  }
  const qs = params.toString();
  permanentRedirect(qs ? `/checkout/vigil?${qs}` : '/checkout/vigil');
}
