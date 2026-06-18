import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorize";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requirePermission(slug, "view_budget");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const item = await prisma.budgetItem.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!item) return Response.json({ error: "Budget item not found" }, { status: 404 });

  const body = await req.json();
  const { category, description, amount, type, date, notes } = body;

  const updated = await prisma.budgetItem.update({
    where: { id },
    data: {
      ...(category !== undefined && { category }),
      ...(description !== undefined && { description }),
      ...(amount !== undefined && { amount: Number(amount) }),
      ...(type !== undefined && { type }),
      ...(date !== undefined && { date: new Date(date) }),
      ...(notes !== undefined && { notes: notes || null }),
    },
    select: {
      id: true,
      category: true,
      description: true,
      amount: true,
      type: true,
      date: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
      createdBy: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return Response.json({ item: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { slug, id } = await params;
  const auth = await requirePermission(slug, "view_budget");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const item = await prisma.budgetItem.findFirst({
    where: { id, workspaceId: workspace.id },
    select: { id: true },
  });
  if (!item) return Response.json({ error: "Budget item not found" }, { status: 404 });

  await prisma.budgetItem.delete({ where: { id } });

  return Response.json({ ok: true });
}
