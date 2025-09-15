"use client";

import dynamic from "next/dynamic";

// Load your App only on the client
const App = dynamic(() => import("../App"), { ssr: false });

export default function ClientOnly() {
  return <App />;
}
