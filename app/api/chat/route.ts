import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPTS: Record<string, string> = {
  homework: "Sen Subject-GPT — aqlli o'quv yordamchisi. O'zbek tilida tushuntir.",
  math: "Sen matematik masalalar echuvchisi. Bosqichma-bosqich yech.",
  quiz: "Sen quiz yaratuvchisi. 5 ta savol yarat, 4 ta variant bilan.",
  grammar: "Sen grammatika tekshiruvchisi. Xatolarni ko'rsat va to'g'irla.",
  summary: "Sen summarizer. Qisqa xulosa va asosiy fikrlar ber.",
  essay: "Sen insho yordamchisi. Tuzilma va g'oyalar ber.",
};

export async function POST(req: Request) {
  const { message, mode, history } = await req.json();

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.homework },
      ...history,
      { role: "user", content: message },
    ],
    max_tokens: 1000,
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}