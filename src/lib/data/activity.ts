import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export async function logActivity(params: {
  action: string;
  userId?: string;
  hotelId?: string;
  metadata?: Record<string, unknown>;
}) {
  await prisma.activityLog.create({
    data: {
      action: params.action,
      userId: params.userId,
      hotelId: params.hotelId,
      metadata: params.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export async function listRecentActivity(hotelId: string, limit = 10) {
  return prisma.activityLog.findMany({
    where: { hotelId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { user: { select: { name: true, email: true } } },
  });
}
