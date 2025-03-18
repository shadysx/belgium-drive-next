import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { expo } from "@better-auth/expo";

const prisma = new PrismaClient();
export const auth = betterAuth({
  plugins: [expo()],
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["belgium-drive://"],
  emailAndPassword: {
    enabled: true,
  },
});
