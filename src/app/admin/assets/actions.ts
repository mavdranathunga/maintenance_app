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
