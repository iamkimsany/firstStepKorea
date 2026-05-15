import { NextResponse } from "next/server";
import { getChatModel, getOpenAIClient } from "@/lib/openai";

function toImageDataUrl(input: string): string {
  const trimmed = input.trim();
  const dataUrl = /^data:([^;]+);base64,(.+)$/i.exec(trimmed);
  if (dataUrl) {
    const media = dataUrl[1] === "image/jpg" ? "image/jpeg" : dataUrl[1];
    return `data:${media};base64,${dataUrl[2]}`;
  }
  return `data:image/jpeg;base64,${trimmed}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      imageBase64?: string;
      language?: string;
    };

    if (!body.imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    const language = body.language?.trim() || "English";
    const imageUrl = toImageDataUrl(body.imageBase64);

    const system = `The user sent a photo of a Korean document.

Identify the document and respond with:
📄 This is a [document name in English and Korean]
💡 What it means: [simple explanation]
✅ What to do: [numbered steps]
📍 Where to go: [exact location or website]
⏰ Deadline: [if urgent, add ⚠️]

Documents to recognize:
- 전기요금 고지서 = electricity bill 
  → pay at GS25/CU convenience store or ATM
- 가스요금 고지서 = gas bill
  → pay at convenience store
- 건강보험료 고지서 = NHIS health insurance
  → ⚠️ affects visa renewal! pay at nhis.or.kr
- 계약서 = rental contract
  → register at 주민센터 within 14 days!
- 영수증 = receipt
- 세금 = tax document → visit local tax office
- 은행 = bank document

Always respond in ${language}.
Keep response under 200 words.`;

    const openai = getOpenAIClient();
    const completion = await openai.chat.completions.create({
      model: getChatModel(),
      max_tokens: 900,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageUrl, detail: "high" },
            },
            {
              type: "text",
              text: "Analyze this document image and follow the output format.",
            },
          ],
        },
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
