// app/error.tsx
"use client";

import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-6 bg-red-50 text-red-700 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Application Error</h2>
      <pre className="whitespace-pre-wrap mb-4">{error.message}</pre>
      <Button onClick={reset} variant={"destructive"}>
        Try Again
      </Button>
    </div>
  );
}
