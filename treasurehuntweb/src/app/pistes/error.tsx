"use client"; // Error components must be Client Components

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);
  const router = useRouter();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl text-2xl text-primary">
      <h2>Une erreur est survenue. Êtes-vous connecté ?</h2>
      <button className="underline" onClick={() => router.push("/")}>
        Aller à l'accueil
      </button>
    </div>
  );
}
