"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/guards";

const AssetSchema = z.object({
  assetId: z.string().min(2),
  name: z.string().min(2),
  category: z.string().min(2),
  location: z.string().optional(),
  lastMaintenance: z.string().min(10),
  frequencyDays: z.coerce.number().int().min(1),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
});

export async function createAsset(formData: FormData) {
  await requireAdmin();

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

  if (!parsed.success) return;

  await prisma.asset.create({
    data: {
      ...parsed.data,
      lastMaintenance: new Date(parsed.data.lastMaintenance),
    },
  });

  revalidatePath("/admin/assets");
}

export async function deleteAsset(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.asset.delete({ where: { id } });
  revalidatePath("/admin/assets");
}

export async function updateAsset(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") || "");
  if (!id) return;

  await prisma.asset.update({
    where: { id },
    data: {
      assetId: String(formData.get("assetId")),
      name: String(formData.get("name")),
      category: String(formData.get("category")),
      location: String(formData.get("location") || ""),
      lastMaintenance: new Date(String(formData.get("lastMaintenance"))),
      frequencyDays: Number(formData.get("frequencyDays")),
      assignedTo: String(formData.get("assignedTo") || ""),
      notes: String(formData.get("notes") || ""),
    },
  });

  revalidatePath("/admin/assets");
}

export async function completeMaintenance(formData: FormData) {
  await requireAdmin();

  const assetId = String(formData.get("assetId") || "");
  const remark = String(formData.get("remark") || "");
  const performedAtStr = String(formData.get("performedAt") || "");

  if (!assetId || !performedAtStr) return;

  // optional: store which admin did it
  // const session = await requireAdmin();
  // const userId = (session.user as any)?.id;

  await prisma.$transaction(async (tx) => {
    // record
    await tx.maintenanceRecord.create({
      data: {
        assetId,
        action: "COMPLETED",
        performedAt: new Date(performedAtStr),
        remark: remark || null,
        // performedById: userId ?? null,
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
}

export async function rescheduleMaintenance(formData: FormData) {
  await requireAdmin();

  const assetId = String(formData.get("assetId") || "");
  const scheduledForStr = String(formData.get("scheduledFor") || "");
  const remark = String(formData.get("remark") || "");

  if (!assetId || !scheduledForStr) return;

  await prisma.maintenanceRecord.create({
    data: {
      assetId,
      action: "RESCHEDULED",
      scheduledFor: new Date(scheduledForStr),
      remark: remark || null,
      // performedById: userId ?? null,
    },
  });

  revalidatePath("/admin/assets");
}