import { z } from 'zod'

export const ChainSchema = z.enum(['bsc', 'ethereum'])

export type ChainKey = z.infer<typeof ChainSchema>

export const CHAIN_IDS = {
  bsc: 56,
  ethereum: 1,
} as const
