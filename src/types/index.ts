export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export interface MintStatus {
  loading: boolean;
  success: boolean;
  error: string | null;
  txHash?: string;
  tokenId?: number;
}

export interface WalletState {
  address: string | null;
  chainId: number | null;
  connected: boolean;
}
