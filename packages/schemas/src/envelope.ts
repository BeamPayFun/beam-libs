import { z } from 'zod'
import { AddressSchema, HexSignatureSchema } from './auth.js'
import { ChainSchema, type ChainKey } from './chain.js'
import { OrderKeySchema } from './orderKey.js'

const BASIS_POINTS_HARD_LIMIT = 10

export const OrderEnvelopeSchema = z
  .object({
    chain: ChainSchema,
    merchant: AddressSchema,
    receiver: AddressSchema,
    token: AddressSchema,
    amount: z.string().regex(/^\d+$/),
    orderId: OrderKeySchema,
    memo: z.string().max(256).optional(),
    feeBps: z.number().int().min(0).max(BASIS_POINTS_HARD_LIMIT),
    signer: AddressSchema,
    createdAt: z.number().int().positive(),
    expiresAt: z.number().int().positive(),
    signature: HexSignatureSchema,
    isDelegate: z.boolean(),
  })
  .strict()
  .refine((v) => v.expiresAt > v.createdAt, {
    message: 'expiresAt must be > createdAt',
    path: ['expiresAt'],
  })

export type OrderEnvelope = z.infer<typeof OrderEnvelopeSchema>

export interface OrderTypedDataInput {
  chainId: number
  verifyingContract: `0x${string}`
  merchant: `0x${string}`
  receiver: `0x${string}`
  signer: `0x${string}`
  token: `0x${string}`
  amount: bigint
  orderId: `0x${string}`
  createdAt: bigint
  expiresAt: bigint
}

export const ORDER_EIP712_TYPES = {
  Order: [
    { name: 'merchant', type: 'address' },
    { name: 'receiver', type: 'address' },
    { name: 'signer', type: 'address' },
    { name: 'token', type: 'address' },
    { name: 'amount', type: 'uint256' },
    { name: 'orderId', type: 'bytes32' },
    { name: 'createdAt', type: 'uint64' },
    { name: 'expiresAt', type: 'uint64' },
  ],
} as const

export function buildOrderTypedData(p: OrderTypedDataInput) {
  return {
    domain: {
      name: 'BeamRouter',
      version: '1',
      chainId: p.chainId,
      verifyingContract: p.verifyingContract,
    } as const,
    types: ORDER_EIP712_TYPES,
    primaryType: 'Order' as const,
    message: {
      merchant: p.merchant,
      receiver: p.receiver,
      signer: p.signer,
      token: p.token,
      amount: p.amount,
      orderId: p.orderId,
      createdAt: p.createdAt,
      expiresAt: p.expiresAt,
    },
  }
}

export function envelopeToTypedData(
  envelope: OrderEnvelope,
  chainId: number,
  verifyingContract: `0x${string}`,
) {
  return buildOrderTypedData({
    chainId,
    verifyingContract,
    merchant: envelope.merchant as `0x${string}`,
    receiver: envelope.receiver as `0x${string}`,
    signer: envelope.signer as `0x${string}`,
    token: envelope.token as `0x${string}`,
    amount: BigInt(envelope.amount),
    orderId: envelope.orderId as `0x${string}`,
    createdAt: BigInt(envelope.createdAt),
    expiresAt: BigInt(envelope.expiresAt),
  })
}

export type EnvelopeChain = ChainKey
