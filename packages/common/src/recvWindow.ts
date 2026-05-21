import { BaseResponse } from './baseResponse'
import { ErrorCode } from './errorCode'

export function validateRecvWindow(recvWindow: number): void {
  if (!Number.isFinite(recvWindow) || recvWindow < 1 || recvWindow > 60_000) {
    throw BaseResponse.create(ErrorCode.INVALID_RECV_WINDOW)
  }
}

export function validateTimestamp(timestamp: number, serverTime: number, recvWindow: number): void {
  validateRecvWindow(recvWindow)
  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    throw BaseResponse.create(ErrorCode.INVALID_TIMESTAMP)
  }
  if (serverTime - timestamp > recvWindow) {
    throw BaseResponse.create(ErrorCode.REQUEST_TIMEOUT)
  }
}
