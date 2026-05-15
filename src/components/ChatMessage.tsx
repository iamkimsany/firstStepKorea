"use client";

import type { Message } from "@/types";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-primary text-white rounded-br-md"
            : "bg-surface text-ink rounded-bl-md border border-border"
        }`}
      >
        {message.imageUrl ? (
          <div className="relative mb-2 overflow-hidden rounded-xl border border-white/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={message.imageUrl}
              alt="Uploaded"
              className="h-auto max-h-48 w-full object-cover"
            />
          </div>
        ) : null}
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
