import { ApiSignatureUtil } from '@beam/common'

export interface VerifyWebhookOptions {
  signatureSalt: string
  recvWindow?: number
}

export async function verifyWebhook(
  body: Record<string, unknown>,
  opts: VerifyWebhookOptions,
): Promise<boolean> {
  if (!body || typeof body !== 'object') return false

  const timestamp = body.timestamp as number | undefined
  const recvWindow = (body.recvWindow as number | undefined) ?? opts.recvWindow ?? 5000
  const signature = body.signature as string | undefined

  if (typeof signature !== 'string' || signature.length === 0) return false
  if (typeof timestamp !== 'number' || !Number.isFinite(timestamp) || timestamp <= 0) return false
  if (!Number.isFinite(recvWindow) || recvWindow < 1 || recvWindow > 60_000) return false
  if (Date.now() - timestamp > recvWindow) return false

  const message = ApiSignatureUtil.getSignatureStr(body)
  return ApiSignatureUtil.verify(message, signature, opts.signatureSalt)
}
