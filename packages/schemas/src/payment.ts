import { z } from 'zod'
import { ChainSchema } from './chain.js'
import { OrderKeySchema } from './orderKey.js'

export const GetOrderQuerySchema = z.object({
  chain: ChainSchema,
  orderKey: OrderKeySchema,
})

export const OrderResponseSchema = z.object({
  chain: ChainSchema,
  orderKey: OrderKeySchema,
  amount: z.string(),
  token: z.string(),
  merchant: z.string(),
  payer: z.string().nullable(),
  status: z.enum(['pending', 'paid', 'refunded']),
})

export const CreateOrderBodySchema = z.object({
  chain: ChainSchema,
  merchant: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  token: z.string().regex(/^0x[0-9a-fA-F]{40}$/),
  amount: z.string().regex(/^\d+$/),
})
