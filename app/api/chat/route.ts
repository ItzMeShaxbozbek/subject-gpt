import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { message, mode } = await req.json();

  const prompts: Record<string, string> = {
    homework: "Sen aqlli o'quv yordamchisi. O'zbek tilida tushuntir.",
    math: "Sen matematik masalalar echuvchisi. Bosqichma-bosqich yech.",
    quiz: "5 ta test savol yarat, 4 ta variant bilan. O'zbek tilida.",
    grammar: "Grammatika tekshiruvchisi. Xatolarni ko'rsat.",
    summary: "Matnni qisqa xulosa qil.",
  };

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: prompts[mode] || prompts.homework },
      { role: "user", content: message },
    ],
    max_tokens: 1000,
  });

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  });
}