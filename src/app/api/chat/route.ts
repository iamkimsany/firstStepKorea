import { NextResponse } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { getChatModel, getOpenAIClient } from "@/lib/openai";
import type { Message, UserProfile } from "@/types";

function buildSystemPrompt(profile: UserProfile) {
  const uni = profile.university ?? "Not specified";
  return `You are FirstStep Korea, an AI guide for international students in Korea.

Student profile:
- Visa: ${profile.visaType}
- University: ${uni}
- Arrived: ${profile.arrivalTime}
- Scholarship: ${profile.scholarship}

CRITICAL RULES:
1. ALWAYS respond in the EXACT same language the user writes in. Russian → Russian. English → English. Uzbek → Uzbek. Never switch.
2. Be specific and practical, never generic
3. Always give the correct ORDER of steps
4. Keep responses under 150 words
5. Use numbered lists for instructions
6. Add ⚠️ for urgent warnings

UNIVERSITY-SPECIFIC INFO:
Sookmyung Women's University:
- International Office: 순헌관 1F, Mon-Fri 9am-5pm
- Best bank: IBK Bank (branch ON campus!)
- Dorm deposit: ₩300,000
- Email: international@sookmyung.ac.kr

Yonsei University:
- International Office: Underwood Hall 1F
- Best bank: Shinhan Bank Sinchon branch

${profile.university === "Sookmyung" ? `
SOOKMYUNG CAMPUS RESOURCES:
- Certificates: Kiosk at 학생회관 3층 (9am-10pm, ₩1,000, instant) | Online 24/7 free
- Korean Clinic: FREE writing correction, wise.sookmyung.ac.kr, max 15-20 spots, takes 10 days, upload as 비밀글
- SKEV: FREE Korean exchange, Instagram @smwu._.skev
- Tuition installment (분할납부): 4 payments of 25%, apply mid-Feb/mid-Aug, NOT available for first semester students
- International Services: 행정관 203호, Mon-Fri 9-5, 02-710-9256, studyabroad@sm.ac.kr
` : ""}
Korea University:
- International Office: International Hall 1F
- Best bank: Hana Bank on campus

Hanyang University:
- International Office: Student Hall 2F

Ewha Womans University:
- International Office: Main Building 1F

CRITICAL KNOWLEDGE:
Correct order D-2 visa:
1. Temporary SIM at airport (passport only)
2. Find housing / move into dorm
3. Register address at local 구청
4. Apply for ARC (within 90 days!)
5. Open FULL bank account with ARC
6. Upgrade phone plan with ARC
7. Register NHIS after 6 months

Banking:
- Without ARC: limited account, ₩300,000 limit
- Best banks: IBK, Hana, Shinhan, Woori
- Money transfer limit: $5,000/transaction, $50,000/year
- Best transfer services: SentBe, Wise, Wirebarley

Housing:
- Always pay deposit via bank transfer
- Register lease at 주민센터 within 14 days!
- This legally protects your deposit

NHIS Insurance:
- Mandatory after 6 months
- ⚠️ Missing payments can BLOCK visa renewal

DATA FRESHNESS AWARENESS:
- If a user asks about a specific step or resource, remind them to double-check official sources as policies change.
- Add this footer to any response about documents, fees, or deadlines:
  "💡 Double-check this at the official source — rules can change each semester."
- Never say information is "definitely current" or "guaranteed accurate."`;
}

function parseDataUrl(dataUrl: string): string | null {
  const match = /^data:([^;]+);base64,(.+)$/i.exec(dataUrl.trim());
  if (!match) return null;
  return `data:${match[1]};base64,${match[2]}`;
}

function stripLeadingAssistant(messages: Message[]): Message[] {
  const out = [...messages];
  while (out.length > 0 && out[0].role === "assistant") {
    out.shift();
  }
  return out;
}

function toOpenAIMessages(messages: Message[]): ChatCompletionMessageParam[] {
  return messages
    .filter((m) => m.content.trim().length > 0 || m.imageUrl)
    .map((m) => {
      if (m.role === "assistant") {
        return { role: "assistant" as const, content: m.content };
      }
      if (m.imageUrl) {
        const url = m.imageUrl.startsWith("data:")
          ? parseDataUrl(m.imageUrl) ?? m.imageUrl
          : m.imageUrl;
        return {
          role: "user" as const,
          content: [
            {
              type: "image_url" as const,
              image_url: { url, detail: "high" as const },
            },
            {
              type: "text" as const,
              text: m.content.trim() || "See image.",
            },
          ],
        };
      }
      return { role: "user" as const, content: m.content };
    });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: Message[];
      userProfile?: UserProfile;
    };

    if (!body.messages?.length || !body.userProfile) {
      return NextResponse.json(
        { error: "messages and userProfile are required" },
        { status: 400 }
      );
    }

    const prepared = stripLeadingAssistant(body.messages);
    if (!prepared.length) {
      return NextResponse.json(
        { error: "No user messages to respond to" },
        { status: 400 }
      );
    }

    const openai = getOpenAIClient();
    const system = buildSystemPrompt(body.userProfile);
    const userAssistantMessages = toOpenAIMessages(prepared);
    if (!userAssistantMessages.length) {
      return NextResponse.json(
        { error: "No valid messages to send" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: getChatModel(),
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        ...userAssistantMessages,
      ],
    });

    const text =
      completion.choices[0]?.message?.content?.trim() ?? "";

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
