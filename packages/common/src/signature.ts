export class ApiSignatureUtil {
  static getSignatureStr(obj: Record<string, unknown>): string {
    const sorted = Object.keys(obj)
      .filter((k) => k !== 'signature')
      .sort()
      .reduce<Record<string, unknown>>(
        (acc, k) => {
          acc[k] = obj[k]
          return acc
        },
        {} as Record<string, unknown>,
      )

    return JSON.stringify(sorted)
  }

  static async sign(message: string, key: string): Promise<string> {
    const encoder = new TextEncoder()
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(key),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(message))
    return `0x${Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')}`
  }

  static async verify(message: string, signature: string, key: string): Promise<boolean> {
    const expected = await this.sign(message, key)
    if (expected.length !== signature.length) return false

    let result = 0
    for (let i = 0; i < expected.length; i++) {
      result |= expected.charCodeAt(i) ^ signature.charCodeAt(i)
    }
    return result === 0
  }
}
