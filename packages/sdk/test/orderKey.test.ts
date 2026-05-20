import { describe, expect, it } from 'vitest'
import { deriveOrderKey } from '../src/orderKey.js'
import fixtures from './fixtures/orderkey.json'

describe('deriveOrderKey', () => {
  it.each(fixtures)(
    'derives expected orderKey for $merchant',
    ({ merchant, token, amount, salt, expectedOrderKey }) => {
      const result = deriveOrderKey({
        merchant: merchant as `0x${string}`,
        token: token as `0x${string}`,
        amount,
        salt: salt as `0x${string}`,
      })
      expect(result).toBe(expectedOrderKey)
    },
  )
})
