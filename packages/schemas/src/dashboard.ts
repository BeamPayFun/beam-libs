import { z } from 'zod'

export const DashChainSchema = z.string().min(1)

export const KpiEntrySchema = z
  .object({
    value: z.string(),
    sym: z.string(),
    delta: z.string(),
  })
  .strict()

export const TokenSplitEntrySchema = z
  .object({
    sym: z.string(),
    pct: z.number().min(0).max(100),
    color: z.string(),
  })
  .strict()

export const ChainSplitEntrySchema = z
  .object({
    key: z.string(),
    name: z.string(),
    pct: z.number().min(0).max(100),
  })
  .strict()

export const SeriesEntrySchema = z
  .object({
    d: z.number().int(),
    v: z.number(),
    o: z.number().int(),
    r: z.number().int(),
  })
  .strict()

export const OrderRowStatusSchema = z.enum(['paid', 'refunded', 'expired', 'pending'])

export const OrderRowSchema = z
  .object({
    id: z.string(),
    short: z.string(),
    chain: DashChainSchema,
    token: z.string(),
    amount: z.string(),
    payer: z.string(),
    status: OrderRowStatusSchema,
    age: z.string(),
    ageH: z.number(),
  })
  .strict()

export const BalanceSchema = z
  .object({
    sym: z.string(),
    name: z.string(),
    chain: DashChainSchema,
    balance: z.string(),
    usd: z.string(),
  })
  .strict()

export const DashKpiSetSchema = z
  .object({
    gross: KpiEntrySchema,
    net: KpiEntrySchema,
    orders: KpiEntrySchema,
    refunds: KpiEntrySchema,
    success: KpiEntrySchema,
    aov: KpiEntrySchema,
  })
  .strict()

export const DashboardOverviewSchema = z
  .object({
    kpis: DashKpiSetSchema,
    tokenSplit: z.array(TokenSplitEntrySchema),
    chainSplit: z.array(ChainSplitEntrySchema),
    series: z.array(SeriesEntrySchema),
    peakHours: z.array(z.number()).length(24),
    recent: z.array(OrderRowSchema),
    balances: z.array(BalanceSchema),
  })
  .strict()

export const OrderListResponseSchema = z
  .object({
    items: z.array(OrderRowSchema),
    nextCursor: z.string().nullable(),
    total: z.number().int().nonnegative(),
  })
  .strict()

export type KpiEntry = z.infer<typeof KpiEntrySchema>
export type TokenSplitEntry = z.infer<typeof TokenSplitEntrySchema>
export type ChainSplitEntry = z.infer<typeof ChainSplitEntrySchema>
export type SeriesEntry = z.infer<typeof SeriesEntrySchema>
export type OrderRowStatus = z.infer<typeof OrderRowStatusSchema>
export type OrderRow = z.infer<typeof OrderRowSchema>
export type Balance = z.infer<typeof BalanceSchema>
export type DashKpiSet = z.infer<typeof DashKpiSetSchema>
export type DashboardOverview = z.infer<typeof DashboardOverviewSchema>
export type OrderListResponse = z.infer<typeof OrderListResponseSchema>
