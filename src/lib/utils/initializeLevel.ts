import { PrismaClient } from "@prisma/client";

export async function initializeLevel(userId: string, prisma: PrismaClient) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (user?.levelId != null) return;

  const level1 = await prisma.level.findUnique({
    where: {
      level: 1,
    },
  });

  if (!level1) return;

  await prisma.user.update({
    where: { id: userId },
    data: {
      levelId: level1.id,
    },
  });
}
