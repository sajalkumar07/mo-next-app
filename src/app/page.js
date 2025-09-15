// Keep the page server-safe and disable static prerendering
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import ClientOnly from "./client-only";

export default function Page() {
  return <ClientOnly />;
}
