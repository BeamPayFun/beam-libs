import type { ChainKey } from '@beampay/schemas'

export interface ChainMetadata {
  chainId: number
  name: string
  explorer: string
  beamPayRouter: string
}

export const CHAIN_METADATA: Record<ChainKey, ChainMetadata> = {
  bsc: {
    chainId: 56,
    name: 'BSC',
    explorer: 'https://bscscan.com',
    beamPayRouter: '0x0000000000000000000000000000000000000000',
  },
  ethereum: {
    chainId: 1,
    name: 'Ethereum',
    explorer: 'https://etherscan.io',
    beamPayRouter: '0x0000000000000000000000000000000000000000',
  },
} as const
