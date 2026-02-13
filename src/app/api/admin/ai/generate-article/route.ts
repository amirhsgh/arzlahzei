import { NextRequest, NextResponse } from "next/server";
import { generateArticle } from "@/lib/api/openai";
import { requireAdmin } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "پارامتر prompt الزامی است" },
        { status: 400 }
      );
    }

    const result = await generateArticle(prompt);

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "خطا در تولید مقاله با AI" },
      { status: 500 }
    );
  }
}
