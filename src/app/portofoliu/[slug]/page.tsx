"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectDetailRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/portofoliu");
  }, [router]);
  return (
    <main className="pt-20 min-h-screen flex items-center justify-center">
      <p className="text-ash">Redirecționare...</p>
    </main>
  );
}
