import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

interface AuditInput {
  actorId?: string | null;
  actorName: string;
  source: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Prisma.InputJsonValue | null;
}

export async function createAuditLog(input: AuditInput) {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: input.actorId || null,
        actorName: input.actorName,
        source: input.source,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        details: input.details ?? undefined,
      },
    });
  } catch (error) {
    console.error("Failed to write audit log", error);
  }
}
