import { keccak256, encodeAbiParameters, parseAbiParameters } from 'viem'

/**
 * Derive the order key that BeamRouter uses internally.
 *
 * Solidity equivalent:
 *   keccak256(abi.encode(merchant, token, amount, salt))
 */
export function deriveOrderKey(
  merchant: string,
  token: string,
  amount: bigint | string | number,
  salt: string,
): string {
  return keccak256(
    encodeAbiParameters(parseAbiParameters('address, address, uint256, bytes32'), [
      merchant as `0x${string}`,
      token as `0x${string}`,
      BigInt(amount),
      salt as `0x${string}`,
    ]),
  )
}
