"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { PhotoUpload } from "@/components/PhotoUpload";
import { UniversityBadge } from "@/components/UniversityBadge";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";
import type { Message, UserProfile } from "@/types";
import { PROFILE_STORAGE_KEY } from "@/lib/storage";

const QUICK_CHIP_KEYS = [
  { labelKey: "chat.chip.bank",       promptKey: "chat.prompt.bank" },
  { labelKey: "chat.chip.arc",        promptKey: "chat.prompt.arc" },
  { labelKey: "chat.chip.deposit",    promptKey: "chat.prompt.deposit" },
  { labelKey: "chat.chip.send-money", promptKey: "chat.prompt.send-money" },
  { labelKey: "chat.chip.nhis",       promptKey: "chat.prompt.nhis" },
  { labelKey: "chat.chip.documents",  promptKey: "chat.prompt.documents" },
] as const;

function loadProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw) as UserProfile; } catch { return null; }
}

export default function ChatPage() {
  const { t, language } = useLanguage();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Build intro message reactively based on language
  const introMessage: Message = useMemo(
    () => ({ role: "assistant", content: t("chat.intro") }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language]
  );

  useEffect(() => {
    setProfile(loadProfile());
    setMessages([{ role: "assistant", content: t("chat.intro") }]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update intro message when language changes (only if it's the first message)
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].role === "assistant") {
        return [introMessage];
      }
      return prev;
    });
  }, [introMessage]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  const sendChat = useCallback(async (nextMessages: Message[]) => {
    const p = profile ?? loadProfile();
    if (!p) { setError(t("chat.onboarding-error")); return; }
    setBusy(true); setError(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, userProfile: p }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.text || "" }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setBusy(false); }
  }, [profile, t]);

  async function handleSendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next); setInput(""); await sendChat(next);
  }

  async function handlePhoto(_file: File, dataUrl: string) {
    if (busy) return;
    const userMsg: Message = { role: "user", content: "Please analyze this Korean document.", imageUrl: dataUrl };
    setMessages((prev) => [...prev, userMsg]); setBusy(true); setError(null);
    try {
      const language = typeof navigator !== "undefined" ? navigator.language || "en" : "en";
      const res = await fetch("/api/analyze-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: dataUrl, language }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Image analysis failed");
      setMessages((prev) => [...prev, { role: "assistant", content: data.text || "" }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  return (
    <main className="page-enter flex min-h-0 flex-1 flex-col bg-white">
      {/* header */}
      <header className="shrink-0 border-b-2 border-black bg-white px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="neo-label">{t("chat.kicker")}</span>
            {profile?.university ? (
              <div className="mt-2"><UniversityBadge university={profile.university} /></div>
            ) : (
              <p className="mt-1 text-xs font-medium text-muted">{t("chat.noProfile")}</p>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 border-2 border-black px-2 py-1 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: "var(--yellow)" }}>
              {t("chat.online")}
            </div>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {error ? (
        <div className="mx-5 mt-3 shrink-0 border-2 border-black px-4 py-2.5 text-xs font-semibold text-black"
          style={{ borderLeft: "4px solid #FAC800" }}>
          {error}
        </div>
      ) : null}

      {/* messages */}
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-5">
        {messages.map((m, idx) => (
          <ChatMessage key={`${idx}-${m.role}-${m.content.slice(0, 12)}`} message={m} />
        ))}
        {busy ? (
          <div className="flex justify-start">
            <div className="border-2 border-black bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-muted"
              style={{ boxShadow: "2px 2px 0 #0A0A0A" }}>
              {t("chat.thinking")}
            </div>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {/* input area */}
      <div className="shrink-0 border-t-2 border-black bg-white px-4 pb-3 pt-3">
        {/* quick chips */}
        <div className="chips-scroll mb-3 flex gap-2 overflow-x-auto pb-1">
          {QUICK_CHIP_KEYS.map((c) => (
            <button key={c.labelKey} type="button" disabled={busy}
              onClick={() => handleSendText(t(c.promptKey as Parameters<typeof t>[0]))}
              className="whitespace-nowrap border-2 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition hover:bg-[var(--yellow)] disabled:opacity-40"
              style={{ background: "white", boxShadow: "2px 2px 0 #0A0A0A" }}>
              {t(c.labelKey as Parameters<typeof t>[0])}
            </button>
          ))}
        </div>

        <div className="flex items-stretch gap-2">
          <PhotoUpload onPick={handlePhoto} disabled={busy} />
          <div className="flex h-11 flex-1 items-center border-2 border-black bg-white px-3 focus-within:shadow-[inset_0_0_0_1px_#0A0A0A]">
            <input value={input} onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendText(input); } }}
              disabled={busy} placeholder={t("chat.placeholder")}
              className="w-full bg-transparent text-sm font-medium text-black outline-none placeholder:text-muted disabled:opacity-50" />
          </div>
          <button type="button" disabled={busy || !input.trim()} onClick={() => handleSendText(input)}
            className="flex h-11 w-11 shrink-0 items-center justify-center border-2 border-black font-bold transition disabled:cursor-not-allowed disabled:opacity-40"
            style={{ background: "var(--yellow)", boxShadow: "2px 2px 0 #0A0A0A" }} aria-label="Send">
            →
          </button>
        </div>
      </div>
    </main>
  );
}
