"use client";

import { useRef } from "react";

export function PhotoUpload({
  onPick,
  disabled,
}: {
  onPick: (file: File, dataUrl: string) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        onPick(file, result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn border border-border bg-white text-lg shadow-sm transition hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Upload photo"
      >
        📷
      </button>
    </>
  );
}
