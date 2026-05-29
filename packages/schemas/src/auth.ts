import { z } from 'zod'

export const AddressSchema = z.string().regex(/^0x[0-9a-fA-F]{40}$/)
export type Address = z.infer<typeof AddressSchema>

export const HexSignatureSchema = z.string().regex(/^0x[0-9a-fA-F]+$/)

export const TOKEN_VALIDITY_MS = 30 * 24 * 60 * 60 * 1000

export const LoginMessagePrefix = 'BeamPay Dashboard Login'

export function buildLoginMessage(address: string, issuedAt: number): string {
  const expiresAt = issuedAt + TOKEN_VALIDITY_MS
  return [
    LoginMessagePrefix,
    `Address: ${address}`,
    `Issued: ${issuedAt}`,
    `Expires: ${expiresAt}`,
  ].join('\n')
}

const escapeForRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

export const LoginMessagePattern = new RegExp(
  [
    `^${escapeForRegex(LoginMessagePrefix)}\\n`,
    `Address: (0x[0-9a-fA-F]{40})\\n`,
    `Issued: (\\d+)\\n`,
    `Expires: (\\d+)$`,
  ].join(''),
)

export function parseLoginMessage(
  message: string,
): { address: string; issuedAt: number; expiresAt: number } | null {
  const m = LoginMessagePattern.exec(message)
  if (!m) return null
  return {
    address: m[1],
    issuedAt: Number(m[2]),
    expiresAt: Number(m[3]),
  }
}

export const LoginRequestSchema = z
  .object({
    address: AddressSchema,
    message: z.string().min(1).max(512),
    signature: HexSignatureSchema,
    issuedAt: z.number().int().positive(),
  })
  .strict()

export const LoginResponseSchema = z
  .object({
    token: z.string().min(1),
    expiresAt: z.number().int().positive(),
  })
  .strict()

export const AuthMeResponseSchema = z
  .object({ address: AddressSchema })
  .strict()

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type LoginResponse = z.infer<typeof LoginResponseSchema>
export type AuthMeResponse = z.infer<typeof AuthMeResponseSchema>
