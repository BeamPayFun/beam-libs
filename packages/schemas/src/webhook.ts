import { z } from 'zod'
import { ChainSchema } from './chain.js'
import { OrderKeySchema } from './orderKey.js'

export const PaymentWebhookBodySchema = z
  .object({
    chain: ChainSchema,
    orderKey: OrderKeySchema,
    eventType: z.enum(['Payment', 'Refund']),
    txHash: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
    payload: z.record(z.unknown()),
    timestamp: z.number(),
    recvWindow: z.number().min(1).max(60000),
    salt: z.string().min(1).max(128),
    signature: z.string().regex(/^0x[0-9a-fA-F]{64}$/),
  })
  .strict()

export const FeeRedirectWebhookBodySchema = z
  .object({
    chain: ChainSchema,
    orderKey: OrderKeySchema,
    txHash: z.string(),
    timestamp: z.number(),
    recvWindow: z.number(),
    salt: z.string(),
    signature: z.string(),
  })
  .strict()

export type PaymentWebhookBody = z.infer<typeof PaymentWebhookBodySchema>
export type FeeRedirectWebhookBody = z.infer<typeof FeeRedirectWebhookBodySchema>
