import { describe, expect, it, vi } from 'vitest'
import { verifyWebhook } from '../src/webhook.js'
import { ApiSignatureUtil } from '@beam/common'

describe('verifyWebhook', () => {
  it('rejects expired recvWindow', async () => {
    const body = {
      chain: 'bsc',
      orderKey: '0x'.padEnd(66, '0'),
      timestamp: Date.now() - 70000,
      recvWindow: 5000,
      signature: '0x'.padEnd(66, '0'),
    }
    expect(await verifyWebhook(body, { signatureSalt: 'secret' })).toBe(false)
  })

  it('rejects invalid recvWindow values', async () => {
    const now = Date.now()
    expect(
      await verifyWebhook(
        { timestamp: now, recvWindow: 0, signature: '0x00' },
        { signatureSalt: 's' },
      ),
    ).toBe(false)
    expect(
      await verifyWebhook(
        { timestamp: now, recvWindow: 60001, signature: '0x00' },
        { signatureSalt: 's' },
      ),
    ).toBe(false)
  })

  it('accepts valid webhook with correct signature', async () => {
    const body = {
      chain: 'bsc',
      orderKey: '0x'.padEnd(66, '0'),
      eventType: 'Payment',
      txHash: '0x'.padEnd(66, '0'),
      payload: { foo: 'bar' },
      timestamp: Date.now(),
      recvWindow: 10000,
      salt: 's1',
      signature: '',
    }
    const salt = 'my-salt'
    body.signature = await ApiSignatureUtil.sign(
      ApiSignatureUtil.getSignatureStr(body),
      salt,
    )
    expect(await verifyWebhook(body, { signatureSalt: salt })).toBe(true)
  })
})
