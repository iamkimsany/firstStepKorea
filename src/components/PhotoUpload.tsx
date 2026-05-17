"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";

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
      if (typeof result === "string") onPick(file, result);
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
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black bg-white transition disabled:cursor-not-allowed disabled:opacity-40"
        style={{ boxShadow: "2px 2px 0 #0A0A0A" }}
        aria-label="Upload photo"
      >
        <Camera size={18} />
      </button>
    </>
  );
}
