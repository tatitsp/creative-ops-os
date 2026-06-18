import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/authorize";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requirePermission(slug, "view_budget");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const items = await prisma.budgetItem.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { date: "desc" },
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

  const totalIncome = items
    .filter((i) => i.type === "INCOME")
    .reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = items
    .filter((i) => i.type === "EXPENSE")
    .reduce((sum, i) => sum + i.amount, 0);
  const net = totalIncome - totalExpenses;

  return Response.json({ items, summary: { totalIncome, totalExpenses, net } });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const auth = await requirePermission(slug, "view_budget");
  if (!auth.ok) return auth.response;

  const workspace = await prisma.workspace.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!workspace) return Response.json({ error: "Workspace not found" }, { status: 404 });

  const body = await req.json();
  const { category, description, amount, type, date, notes } = body;

  if (!category || !description || amount === undefined) {
    return Response.json(
      { error: "category, description, and amount are required" },
      { status: 400 }
    );
  }

  const item = await prisma.budgetItem.create({
    data: {
      workspaceId: workspace.id,
      category,
      description,
      amount: Number(amount),
      type: type ?? "EXPENSE",
      date: date ? new Date(date) : new Date(),
      notes: notes || null,
      createdById: auth.ctx.userId,
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

  return Response.json({ item }, { status: 201 });
}
