/**
 * Error codes. Namespaced by service area:
 *   0xx   — generic
 *   1xxx  — monitor / cron
 *   2xxx  — cf-api
 *   3xxx  — beam-api
 *   4xxx  — cron specific
 */
export const ErrorCode = {
  SUCCESS: '0',
  SYSTEM_ERROR: '1000',

  // proxyAuth / cross-service (inherited from monitor / cf-api)
  REQUEST_TIMEOUT: '1002',
  INVALID_SIGNATURE: '1005',
  INVALID_TIMESTAMP: '1007',
  INVALID_SALT: '1008',
  INVALID_RECV_WINDOW: '1009',

  // cf-api
  PARAM_ERROR: '2000',
  SIGNATURE_ERROR: '2001',

  // beam-api
  ORDER_NOT_FOUND: '3001',
  UPSTREAM_ERROR: '3002',
  UNSUPPORTED_CHAIN: '3003',
  INVALID_ORDER_KEY: '3004',

  // cron
  INDEXER_ERROR: '4001',
} as const

export type ErrorCodeValue = (typeof ErrorCode)[keyof typeof ErrorCode]

const ERROR_MSG: Record<string, string> = {
  [ErrorCode.SUCCESS]: 'ok',
  [ErrorCode.SYSTEM_ERROR]: 'system error',
  [ErrorCode.REQUEST_TIMEOUT]: 'request timeout',
  [ErrorCode.INVALID_SIGNATURE]: 'invalid signature',
  [ErrorCode.INVALID_TIMESTAMP]: 'invalid timestamp',
  [ErrorCode.INVALID_SALT]: 'invalid salt',
  [ErrorCode.INVALID_RECV_WINDOW]: 'invalid recv window',
  [ErrorCode.PARAM_ERROR]: 'param error',
  [ErrorCode.SIGNATURE_ERROR]: 'signature error',
  [ErrorCode.ORDER_NOT_FOUND]: 'order not found',
  [ErrorCode.UPSTREAM_ERROR]: 'upstream service error',
  [ErrorCode.UNSUPPORTED_CHAIN]: 'unsupported chain',
  [ErrorCode.INVALID_ORDER_KEY]: 'invalid order key',
  [ErrorCode.INDEXER_ERROR]: 'indexer error',
}

export function getErrorMsg(code: string): string {
  return ERROR_MSG[code] ?? 'unknown error'
}
