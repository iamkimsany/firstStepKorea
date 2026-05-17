"use client";

import type { Message } from "@/types";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] border-2 border-black px-4 py-3 text-sm font-medium leading-relaxed ${
          isUser ? "text-black" : "bg-white text-black"
        }`}
        style={
          isUser
            ? { background: "var(--yellow)", boxShadow: "2px 2px 0 #0A0A0A" }
            : { background: "white",          boxShadow: "2px 2px 0 #0A0A0A" }
        }
      >
        {message.imageUrl ? (
          <div className="relative mb-2.5 overflow-hidden border-2 border-black">
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
