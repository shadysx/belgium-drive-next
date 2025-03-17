import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.questions.findMany();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
