import { withAuth } from "@/lib/api-middleware";
import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    return withAuth(request, async () => {
      const questions = await prisma.quizQuestion.findMany();
      return NextResponse.json(questions);
    });
  } catch {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
