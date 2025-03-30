import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { expo } from "@better-auth/expo";
import { initializeUserAchievements as initializeOrUpdateUserAchievements } from "./utils/initializeOrUpdateUserAchievements";
import { initializeLevel } from "./utils/initializeLevel";

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
  user: {
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        try {
          await prisma.$transaction([
            prisma.userAchievement.deleteMany({
              where: { userId: user.id },
            }),
            prisma.quizResult.deleteMany({
              where: { userId: user.id },
            }),
          ]);
        } catch (error) {
          console.error("Error deleting user", error);
        }
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await initializeOrUpdateUserAchievements(user.id, prisma);
          await initializeLevel(user.id, prisma);
        },
      },
    },
    session: {
      create: {
        after: async (session) => {
          await initializeOrUpdateUserAchievements(session.userId, prisma);
        },
      },
    },
  },
});
