import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Theme } from "@/lib/interfaces/theme.interface";
import { withAuth } from "@/lib/api-middleware";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  return withAuth(request, async () => {
    const themes: Theme[] = await prisma.theme.findMany();

    return NextResponse.json(themes);
  });
}
