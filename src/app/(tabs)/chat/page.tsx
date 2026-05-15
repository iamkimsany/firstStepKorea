"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { PhotoUpload } from "@/components/PhotoUpload";
import { UniversityBadge } from "@/components/UniversityBadge";
import type { Message, UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

const INTRO_MESSAGE: Message = {
  role: "assistant",
  content: `Hi! I'm your FirstStep Korea guide 🇰🇷
I know everything about living in Korea as an international student.
Ask me anything in your language!`,
};

const QUICK_CHIPS: { label: string; prompt: string }[] = [
  { label: "🏦 How to open a bank account?", prompt: "How to open a bank account?" },
  { label: "🛂 How to get my ARC?", prompt: "How do I get my ARC?" },
  { label: "🏠 How to protect my deposit?", prompt: "How do I protect my housing deposit?" },
  { label: "💸 How to send money home?", prompt: "How do I send money home from Korea?" },
  { label: "📋 What documents do I need?", prompt: "What documents do I need for immigration and banking?" },
];

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export default function ChatPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setProfile(loadProfile());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  const sendChat = useCallback(
    async (nextMessages: Message[]) => {
      const p = profile ?? loadProfile();
      if (!p) {
        setError("Complete onboarding first so I can personalize answers.");
        return;
      }
      setBusy(true);
      setError(null);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages, userProfile: p }),
        });
        const data = (await res.json()) as { text?: string; error?: string };
        if (!res.ok) {
          throw new Error(data.error || "Request failed");
        }
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.text || "" },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setBusy(false);
      }
    },
    [profile]
  );

  async function handleSendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const userMsg: Message = { role: "user", content: trimmed };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    await sendChat(next);
  }

  async function handlePhoto(_file: File, dataUrl: string) {
    if (busy) return;
    const userMsg: Message = {
      role: "user",
      content: "Please analyze this Korean document.",
      imageUrl: dataUrl,
    };
    setMessages((prev) => [...prev, userMsg]);
    setBusy(true);
    setError(null);
    try {
      const language =
        typeof navigator !== "undefined"
          ? navigator.language || "en"
          : "en";
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl, language }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Image analysis failed");
      }
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.text || "" },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page-enter flex min-h-0 flex-1 flex-col bg-surface">
      <header className="shrink-0 border-b border-border bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Chat
            </p>
            {profile?.university ? (
              <div className="mt-1">
                <UniversityBadge university={profile.university} />
              </div>
            ) : (
              <p className="mt-1 text-xs font-semibold text-muted">
                Complete onboarding for school-specific tips
              </p>
            )}
            <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-success">
              <span className="inline-block h-2 w-2 rounded-full bg-success" />
              AI Online
            </p>
          </div>
        </div>
      </header>

      {error ? (
        <div className="mx-4 mt-3 shrink-0 rounded-card border border-error/30 bg-error/10 px-3 py-2 text-xs text-error">
          {error}
        </div>
      ) : null}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, idx) => (
          <ChatMessage key={`${idx}-${m.role}-${m.content.slice(0, 12)}`} message={m} />
        ))}
        {busy ? (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted shadow-sm">
              Thinking…
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 border-t border-border bg-white/95 px-3 pb-2 pt-2 backdrop-blur">
        <div className="chips-scroll mb-2 flex gap-2 overflow-x-auto pb-1">
          {QUICK_CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              disabled={busy}
              onClick={() => handleSendText(c.prompt)}
              className="whitespace-nowrap rounded-chip border border-border bg-surface px-3 py-2 text-xs font-semibold text-ink shadow-sm transition hover:border-primary disabled:opacity-50"
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2 pb-1">
          <PhotoUpload onPick={handlePhoto} disabled={busy} />
          <div className="flex flex-1 items-center gap-2 rounded-btn border border-border bg-white px-3 py-1 shadow-inner">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendText(input);
                }
              }}
              disabled={busy}
              placeholder="Ask anything..."
              className="min-h-[44px] w-full flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-muted disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            disabled={busy || !input.trim()}
            onClick={() => handleSendText(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-primary text-lg font-bold text-white shadow-md transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-primary/40"
            aria-label="Send"
          >
            ➤
          </button>
        </div>
      </div>
    </main>
  );
}
