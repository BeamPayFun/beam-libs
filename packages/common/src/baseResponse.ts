import { ErrorCode, getErrorMsg } from './errorCode'

/**
 * Unified JSON response shape matching monitor's BaseResponse.
 *
 *   { code: string, msg: string, data?: unknown, timestamp: number }
 *
 * The class is also throwable; guards/handlers `throw` a BaseResponse and the
 * global error handler converts it into a JSON body.
 */
export class BaseResponse<T = unknown> extends Error {
  readonly code: string
  readonly msg: string
  readonly data?: T
  readonly timestamp: number

  constructor(code: string, msg?: string, data?: T) {
    super(msg ?? getErrorMsg(code))
    this.code = code
    this.msg = msg ?? getErrorMsg(code)
    this.data = data
    this.timestamp = Date.now()
  }

  static create<T>(code: string, msg?: string, data?: T): BaseResponse<T> {
    return new BaseResponse(code, msg, data)
  }

  static ok<T>(data?: T): BaseResponse<T> {
    return new BaseResponse(ErrorCode.SUCCESS, getErrorMsg(ErrorCode.SUCCESS), data)
  }

  static fail(code: string, msg?: string): BaseResponse<never> {
    return new BaseResponse(code, msg ?? getErrorMsg(code))
  }

  toJSON() {
    return {
      code: this.code,
      msg: this.msg,
      data: this.data,
      timestamp: this.timestamp,
    }
  }
}
