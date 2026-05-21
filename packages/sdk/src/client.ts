import { ApiSignatureUtil, BaseResponse } from '@beam/common'
import type { CreateOrderBody, GetOrderQuery, OrderResponse } from '@beam/schemas'
import { Hono } from 'hono'
import { hc } from 'hono/client'

function generateSalt(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2)}`
}

// Minimal app type for hc inference — mirrors beam-api routes
const _app = new Hono()
  .get('/v1/payment/order', (c) => c.json(BaseResponse.ok({} as OrderResponse).toJSON()))
  .post('/v1/payment/order', (c) => c.json(BaseResponse.ok({ orderKey: '' }).toJSON()))
  .post('/v1/webhook/payment', (c) => c.json(BaseResponse.ok({ received: true }).toJSON()))

export type AppType = typeof _app

export class BeamPay {
  private client: ReturnType<typeof hc<AppType>>
  private secret: string

  constructor({ apiUrl, secret }: { apiUrl: string; secret: string }) {
    this.secret = secret
    this.client = hc<AppType>(apiUrl, {
      fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = new URL(input.toString())
        const timestamp = Date.now()
        const recvWindow = 5000
        const salt = generateSalt()

        const query: Record<string, unknown> = {}
        url.searchParams.forEach((v, k) => {
          query[k] = v
        })

        let body: Record<string, unknown> | undefined
        if (init?.body && typeof init.body === 'string') {
          try {
            body = JSON.parse(init.body)
          } catch {
            // non-JSON body, ignore
          }
        }

        const message = ApiSignatureUtil.getSignatureStr({
          query,
          body,
          salt,
          timestamp,
          recvWindow,
        })
        const signature = await ApiSignatureUtil.sign(message, this.secret)

        url.searchParams.set('timestamp', String(timestamp))
        url.searchParams.set('recvWindow', String(recvWindow))
        url.searchParams.set('salt', salt)
        url.searchParams.set('signature', signature)

        return fetch(url.toString(), init)
      },
    })
  }

  async getOrder(chain: string, orderKey: string) {
    const res = await this.client.v1.payment.order.$get({
      query: { chain, orderKey } as GetOrderQuery,
    })
    return (await res.json()) as ReturnType<BaseResponse<OrderResponse>['toJSON']>
  }

  async createOrder(body: CreateOrderBody) {
    const res = await this.client.v1.payment.order.$post({
      json: body,
    })
    return (await res.json()) as ReturnType<BaseResponse<{ orderKey: string }>['toJSON']>
  }
}
