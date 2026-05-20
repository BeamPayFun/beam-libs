import { ApiSignatureUtil } from '@beam/common'
import type { PaymentWebhookBody } from '@beam/schemas'

export interface VerifyWebhookOptions {
  secret: string
  recvWindow?: number
}

export async function verifyWebhook(
  req: Request,
  opts: VerifyWebhookOptions,
): Promise<PaymentWebhookBody> {
  const body = (await req.json()) as PaymentWebhookBody
  const { timestamp, recvWindow, salt, signature } = body
  const now = Date.now()
  const window = recvWindow ?? 5000

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    throw new Error('invalid timestamp')
  }
  if (!Number.isFinite(window) || window < 1 || window > 60_000) {
    throw new Error('invalid recvWindow')
  }
  if (now - timestamp > window) {
    throw new Error('request timeout')
  }

  const expected = await ApiSignatureUtil.sign({
    query: undefined,
    body,
    salt,
    secret: opts.secret,
  })

  if (!ApiSignatureUtil.timingSafeEqualHex(expected, signature)) {
    throw new Error('invalid signature')
  }

  return body
}
