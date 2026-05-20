import { z } from 'zod'

export const OrderKeySchema = z.string().regex(/^0x[0-9a-fA-F]{64}$/)
