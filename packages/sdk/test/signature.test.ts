import { ApiSignatureUtil } from '@beam/common'
import { describe, expect, it } from 'vitest'
import { verifyWebhook } from '../src/webhook.js'

describe('cross-check signature with @beam/common', () => {
  it('produces identical HMAC signatures', async () => {
    const msg = 'test-message'
    const key = 'shared-secret'
    const sig1 = await ApiSignatureUtil.sign(msg, key)
    const sig2 = await ApiSignatureUtil.sign(msg, key)
    expect(sig1).toBe(sig2)
    expect(sig1).toMatch(/^0x[0-9a-f]{64}$/)
  })

  it('verifyWebhook delegates to common utils', async () => {
    const body = {
      chain: 'bsc',
      orderKey: '0x'.padEnd(66, '0'),
      eventType: 'Payment',
      txHash: '0x'.padEnd(66, '0'),
      payload: {},
      timestamp: Date.now(),
      recvWindow: 5000,
      salt: 'salt',
      signature: '',
    }
    const salt = 'webhook-secret'
    body.signature = await ApiSignatureUtil.sign(ApiSignatureUtil.getSignatureStr(body), salt)
    expect(await verifyWebhook(body, { signatureSalt: salt })).toBe(true)
    expect(await verifyWebhook(body, { signatureSalt: 'wrong' })).toBe(false)
  })
})
