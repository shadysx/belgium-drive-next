import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { Session } from "better-auth";

export async function withAuth(
  request: NextRequest,
  handler: (session: Session) => Promise<NextResponse>
) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return handler(session.session);
}
