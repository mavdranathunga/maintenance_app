"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/guards";
import {
  createBadRequestError,
  createValidationError,
  type ErrorResponse,
} from "@/lib/errors";
import { Asset } from "@prisma/client";


const AssetSchema = z.object({
  assetId: z.string().min(2),
  name: z.string().min(2),
  category: z.string().min(2),
  location: z.string().optional(),
  lastMaintenance: z.string().min(10),
  frequencyDays: z.coerce.number().int().min(1),
  assignedTo: z.string().email("Invalid email format").optional().or(z.literal("")),
  notes: z.string().optional(),
});

export async function createAsset(formData: FormData) {
  const session = await requireAdmin();
  const performedBy = session.user?.email ?? null;

  const parsed = AssetSchema.safeParse({
    assetId: formData.get("assetId"),
    name: formData.get("name"),
    category: formData.get("category"),
    location: (formData.get("location") as string) || undefined,
    lastMaintenance: formData.get("lastMaintenance"),
    frequencyDays: formData.get("frequencyDays"),
    assignedTo: (formData.get("assignedTo") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (!parsed.success) {
    return createValidationError(
      "Invalid asset data",
      parsed.error.flatten().fieldErrors
    ).toJSON();
  }

  await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.create({
      data: {
        ...parsed.data,
        lastMaintenance: new Date(parsed.data.lastMaintenance),
      },
    });

    await tx.assetAuditLog.create({
      data: {
        assetId: asset.assetId,
        originalName: asset.name,
        action: "CREATE",
        performedBy,
        details: `Asset registered in ${asset.category} at ${asset.location ?? "Unknown"}`,
      },
    });
  });

  revalidatePath("/admin/assets");
  revalidatePath("/admin/records");
  return { ok: true as const };
}

export async function deleteAsset(formData: FormData) {
  const session = await requireAdmin();
  const performedBy = session.user?.email ?? null;

  const id = String(formData.get("id") || "");
  if (!id) return createBadRequestError("Asset ID is required").toJSON();

  await prisma.$transaction(async (tx) => {
    const asset = await tx.asset.findUnique({ where: { id } });
    if (!asset) throw new Error("Asset not found");

    await tx.assetAuditLog.create({
      data: {
        assetId: asset.assetId,
        originalName: asset.name,
        action: "DELETE",
        performedBy,
        details: `Asset purged from registry. Final location: ${asset.location ?? "N/A"}`,
      },
    });

    await tx.asset.delete({ where: { id } });
  });

  revalidatePath("/admin/assets");
  revalidatePath("/admin/records");
  return { ok: true as const };
}

export async function updateAsset(formData: FormData) {
  const session = await requireAdmin();
  const performedBy = session.user?.email ?? null;

  const id = String(formData.get("id") || "");
  if (!id) return createBadRequestError("Asset ID is required").toJSON();

  const parsed = AssetSchema.safeParse({
    assetId: formData.get("assetId"),
    name: formData.get("name"),
    category: formData.get("category"),
    location: (formData.get("location") as string) || undefined,
    lastMaintenance: formData.get("lastMaintenance"),
    frequencyDays: formData.get("frequencyDays"),
    assignedTo: (formData.get("assignedTo") as string) || undefined,
    notes: (formData.get("notes") as string) || undefined,
  });

  if (!parsed.success) {
    return createValidationError(
      "Invalid asset data",
      parsed.error.flatten().fieldErrors
    ).toJSON();
  }

  await prisma.$transaction(async (tx) => {
    const oldAsset = await tx.asset.findUnique({ where: { id } });

    const asset = await tx.asset.update({
      where: { id },
      data: {
        ...parsed.data,
        lastMaintenance: new Date(parsed.data.lastMaintenance),
      },
    });

    const changes = [];
    if (oldAsset?.name !== asset.name) changes.push(`name: ${oldAsset?.name} -> ${asset.name}`);
    if (oldAsset?.location !== asset.location) changes.push(`loc: ${oldAsset?.location} -> ${asset.location}`);

    await tx.assetAuditLog.create({
      data: {
        assetId: asset.assetId,
        originalName: asset.name,
        action: "UPDATE",
        performedBy,
        details: changes.length > 0 ? `Updated ${changes.join(", ")}` : "Registry metadata updated",
      },
    });
  });

  revalidatePath("/admin/assets");
  revalidatePath("/admin/records");
  return { ok: true as const };
}

export async function completeMaintenance(formData: FormData) {
  const session = await requireAdmin();
  const updatedByEmail = session.user?.email ?? null;

  const assetId = String(formData.get("assetId") || "");
  const remark = String(formData.get("remark") || "");
  const performedAtStr = String(formData.get("performedAt") || "");

  if (!assetId || !performedAtStr) {
    return createBadRequestError("Asset ID and date are required").toJSON();
  }


  await prisma.$transaction(async (tx) => {
    // record
    await tx.maintenanceRecord.create({
      data: {
        assetId,
        action: "COMPLETED",
        performedAt: new Date(performedAtStr),
        remark: remark || null,
        updatedByEmail,
      },
    });

    // update asset lastMaintenance
    await tx.asset.update({
      where: { id: assetId },
      data: {
        lastMaintenance: new Date(performedAtStr),
      },
    });
  });

  revalidatePath("/admin/assets");
  revalidatePath("/dashboard");
  return { ok: true as const };
}

export async function rescheduleMaintenance(formData: FormData) {
  const session = await requireAdmin();
  const updatedByEmail = session.user?.email ?? null;

  const assetId = String(formData.get("assetId") || "");
  const scheduledForStr = String(formData.get("scheduledFor") || "");
  const remark = String(formData.get("remark") || "");

  if (!assetId || !scheduledForStr) {
    return createBadRequestError("Asset ID and date are required").toJSON();
  }

  await prisma.maintenanceRecord.create({
    data: {
      assetId,
      action: "RESCHEDULED",
      scheduledFor: new Date(scheduledForStr),
      remark: remark || null,
      updatedByEmail,
    },
  });

  revalidatePath("/admin/assets");
  revalidatePath("/dashboard");
  return { ok: true as const };
}