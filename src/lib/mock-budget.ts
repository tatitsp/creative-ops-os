// ─── Types ────────────────────────────────────────────────────────────────────

export type BudgetCategory =
  | "VIDEO_PRODUCTION"
  | "PHOTOGRAPHY"
  | "GRAPHIC_DESIGN"
  | "SOCIAL_ADS"
  | "STYLING_WARDROBE"
  | "STUDIO_EQUIPMENT"
  | "FREELANCERS"
  | "DISTRIBUTION_PROMO"
  | "MISCELLANEOUS";

export const BUDGET_CATEGORIES: BudgetCategory[] = [
  "VIDEO_PRODUCTION",
  "PHOTOGRAPHY",
  "GRAPHIC_DESIGN",
  "SOCIAL_ADS",
  "STYLING_WARDROBE",
  "STUDIO_EQUIPMENT",
  "FREELANCERS",
  "DISTRIBUTION_PROMO",
  "MISCELLANEOUS",
];

export const CATEGORY_LABELS: Record<BudgetCategory, string> = {
  VIDEO_PRODUCTION:  "Video Production",
  PHOTOGRAPHY:       "Photography",
  GRAPHIC_DESIGN:    "Graphic Design",
  SOCIAL_ADS:        "Social Media & Ads",
  STYLING_WARDROBE:  "Styling & Wardrobe",
  STUDIO_EQUIPMENT:  "Studio & Equipment",
  FREELANCERS:       "Freelancers & Contractors",
  DISTRIBUTION_PROMO:"Distribution & Promo",
  MISCELLANEOUS:     "Miscellaneous",
};

export interface BudgetLineItem {
  category: BudgetCategory;
  allocated: number;
  spent: number;
}

export interface BudgetTransaction {
  id: string;
  date: string;
  amount: number;
  category: BudgetCategory;
  vendor: string;
  notes: string;
  enteredBy: string;
}

export interface CampaignBudget {
  id: string;
  name: string;
  releaseHref?: string; // link to release room if applicable
  totalBudget: number;
  lineItems: BudgetLineItem[];
  transactions: BudgetTransaction[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getBudgetTotals(budget: CampaignBudget) {
  const totalAllocated = budget.lineItems.reduce((s, li) => s + li.allocated, 0);
  const totalSpent     = budget.lineItems.reduce((s, li) => s + li.spent, 0);
  const totalRemaining = budget.totalBudget - totalSpent;
  const burnPct        = Math.round((totalSpent / budget.totalBudget) * 100);
  return { totalAllocated, totalSpent, totalRemaining, burnPct };
}

export function formatMoney(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_BUDGETS: Record<string, CampaignBudget> = {

  // ── Elijah album rollout — $85,000 ──────────────────────────────────────────
  elijah: {
    id: "elijah",
    name: "Elijah — Album Rollout",
    releaseHref: "/releases/elijah",
    totalBudget: 85_000,
    lineItems: [
      { category: "VIDEO_PRODUCTION",   allocated: 25_000, spent: 12_500 },
      { category: "PHOTOGRAPHY",        allocated:  8_000, spent:  6_200 },
      { category: "GRAPHIC_DESIGN",     allocated:  6_000, spent:  3_800 },
      { category: "SOCIAL_ADS",         allocated: 12_000, spent:  2_100 },
      { category: "STYLING_WARDROBE",   allocated:  4_000, spent:  3_200 },
      { category: "STUDIO_EQUIPMENT",   allocated:  5_000, spent:  4_800 },
      { category: "FREELANCERS",        allocated:  8_000, spent:  3_500 },
      { category: "DISTRIBUTION_PROMO", allocated: 12_000, spent:  1_200 },
      { category: "MISCELLANEOUS",      allocated:  5_000, spent:  1_800 },
    ],
    transactions: [
      {
        id: "et1",
        date: "2026-05-01",
        amount: 12_500,
        category: "VIDEO_PRODUCTION",
        vendor: "Darius King Production",
        notes: "Gravity MV production — full shoot day + color grade + post",
        enteredBy: "Tatiyana",
      },
      {
        id: "et2",
        date: "2026-05-03",
        amount: 4_800,
        category: "STUDIO_EQUIPMENT",
        vendor: "Sound Vault Studios",
        notes: "3-day studio block — final recording and vocal tracking sessions",
        enteredBy: "Tatiyana",
      },
      {
        id: "et3",
        date: "2026-05-07",
        amount: 3_200,
        category: "STYLING_WARDROBE",
        vendor: "Luxe Stylist Co.",
        notes: "MV shoot day styling — 2 looks, wardrobe + accessories",
        enteredBy: "Tatiyana",
      },
      {
        id: "et4",
        date: "2026-05-08",
        amount: 2_200,
        category: "GRAPHIC_DESIGN",
        vendor: "Amara Osei Design",
        notes: "Album cover art (final) + Gravity single artwork",
        enteredBy: "Tatiyana",
      },
      {
        id: "et5",
        date: "2026-05-10",
        amount: 3_800,
        category: "PHOTOGRAPHY",
        vendor: "Kaito Mori Studio",
        notes: "Press photo shoot Set A — 25 selects delivered",
        enteredBy: "Tatiyana",
      },
      {
        id: "et6",
        date: "2026-05-12",
        amount: 2_400,
        category: "PHOTOGRAPHY",
        vendor: "Kaito Mori Studio",
        notes: "Press photo Set B — 50% deposit",
        enteredBy: "Tatiyana",
      },
      {
        id: "et7",
        date: "2026-05-14",
        amount: 2_100,
        category: "SOCIAL_ADS",
        vendor: "Meta Ads Manager",
        notes: "Gravity pre-release awareness campaign — IG + FB",
        enteredBy: "Sofia Reyes",
      },
      {
        id: "et8",
        date: "2026-05-15",
        amount: 1_600,
        category: "GRAPHIC_DESIGN",
        vendor: "Amara Osei Design",
        notes: "Press kit layout + EPK design system",
        enteredBy: "Tatiyana",
      },
      {
        id: "et9",
        date: "2026-05-16",
        amount: 2_500,
        category: "FREELANCERS",
        vendor: "RNK Mix & Master",
        notes: "Album mix & master — 12 tracks, 2 revisions included",
        enteredBy: "Tatiyana",
      },
      {
        id: "et10",
        date: "2026-05-17",
        amount: 1_000,
        category: "FREELANCERS",
        vendor: "LegalEase Music",
        notes: "Distribution agreement review + clearance memo",
        enteredBy: "Tatiyana",
      },
      {
        id: "et11",
        date: "2026-05-18",
        amount: 1_200,
        category: "DISTRIBUTION_PROMO",
        vendor: "DistroKid",
        notes: "Annual distribution subscription + priority delivery for Elijah",
        enteredBy: "Tatiyana",
      },
      {
        id: "et12",
        date: "2026-05-10",
        amount: 1_800,
        category: "MISCELLANEOUS",
        vendor: "Various",
        notes: "Shoot day travel, catering, parking, misc expenses",
        enteredBy: "Tatiyana",
      },
    ],
  },

  // ── Mrs.Key rollout — $62,000 ────────────────────────────────────────────────
  mrskey: {
    id: "mrskey",
    name: "Mrs.Key — Album Rollout",
    totalBudget: 62_000,
    lineItems: [
      { category: "VIDEO_PRODUCTION",   allocated: 18_000, spent: 17_200 },
      { category: "PHOTOGRAPHY",        allocated:  6_500, spent:  5_900 },
      { category: "GRAPHIC_DESIGN",     allocated:  5_500, spent:  5_100 },
      { category: "SOCIAL_ADS",         allocated: 15_000, spent:  9_400 },
      { category: "STYLING_WARDROBE",   allocated:  3_000, spent:  2_800 },
      { category: "STUDIO_EQUIPMENT",   allocated:  3_500, spent:  3_500 },
      { category: "FREELANCERS",        allocated:  5_000, spent:  4_200 },
      { category: "DISTRIBUTION_PROMO", allocated:  3_500, spent:  2_800 },
      { category: "MISCELLANEOUS",      allocated:  2_000, spent:  1_600 },
    ],
    transactions: [
      {
        id: "mt1",
        date: "2026-03-05",
        amount: 14_500,
        category: "VIDEO_PRODUCTION",
        vendor: "Darius King Production",
        notes: "Full album visualizer package — 13 tracks",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt2",
        date: "2026-03-10",
        amount: 5_900,
        category: "PHOTOGRAPHY",
        vendor: "Kaito Mori Studio",
        notes: "Full press photo suite — Sets A & B combined",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt3",
        date: "2026-03-15",
        amount: 5_100,
        category: "GRAPHIC_DESIGN",
        vendor: "Amara Osei Design",
        notes: "Album artwork system — cover, singles, social templates",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt4",
        date: "2026-03-20",
        amount: 2_700,
        category: "VIDEO_PRODUCTION",
        vendor: "Reel Collective",
        notes: "Social cut edits — 8 reels for IG and TikTok",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt5",
        date: "2026-03-25",
        amount: 3_500,
        category: "STUDIO_EQUIPMENT",
        vendor: "Sound Vault Studios",
        notes: "5-day studio block — tracking + overdubs",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt6",
        date: "2026-04-01",
        amount: 2_800,
        category: "STYLING_WARDROBE",
        vendor: "Luxe Stylist Co.",
        notes: "Shoot day styling — 3 full looks",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt7",
        date: "2026-04-05",
        amount: 5_400,
        category: "SOCIAL_ADS",
        vendor: "Meta Ads Manager",
        notes: "Album release campaign — Weeks 1-3 spend",
        enteredBy: "Sofia Reyes",
      },
      {
        id: "mt8",
        date: "2026-04-10",
        amount: 4_200,
        category: "FREELANCERS",
        vendor: "RNK Mix & Master",
        notes: "Full album mix & master — 13 tracks",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt9",
        date: "2026-04-15",
        amount: 2_800,
        category: "DISTRIBUTION_PROMO",
        vendor: "DistroKid + Submithub",
        notes: "Distribution submission + blog pitch package (50 outlets)",
        enteredBy: "Tatiyana",
      },
      {
        id: "mt10",
        date: "2026-04-20",
        amount: 4_000,
        category: "SOCIAL_ADS",
        vendor: "TikTok for Business",
        notes: "Promoted sound page + creator amplification campaign",
        enteredBy: "Sofia Reyes",
      },
      {
        id: "mt11",
        date: "2026-05-01",
        amount: 1_600,
        category: "MISCELLANEOUS",
        vendor: "Various",
        notes: "Launch week logistics — travel, catering, misc",
        enteredBy: "Tatiyana",
      },
    ],
  },
};
