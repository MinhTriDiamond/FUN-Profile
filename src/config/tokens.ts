export interface TokenConfig {
  symbol: string;
  name: string;
  address?: string;
  type: 'NATIVE' | 'BEP20' | 'ERC20';
  decimals: number;
  apiId?: string;
  price?: number;
  source?: 'BINANCE' | 'DEXSCREENER';
  icon: string;
}

export interface NetworkConfig {
  chainId: number;
  name: string;
  icon: string;
  tokens: TokenConfig[];
}

export const TOKENS: Record<'BSC' | 'ETH', TokenConfig[]> = {
  BSC: [
    { 
      symbol: 'BNB', 
      name: 'BNB', 
      type: 'NATIVE', 
      decimals: 18, 
      apiId: 'BNBUSDT',
      icon: '/src/assets/bnb.png'
    },
    { 
      symbol: 'USDT', 
      name: 'Tether USD', 
      address: '0x55d398326f99059fF775485246999027B3197955', 
      type: 'BEP20', 
      decimals: 18, 
      price: 1.00,
      icon: '/src/assets/usdt.png'
    },
    { 
      symbol: 'CAMLY', 
      name: 'Camly Coin', 
      address: '0x0910320181889feFDE0BB1Ca63962b0A8882e413', 
      type: 'BEP20', 
      decimals: 18, 
      source: 'DEXSCREENER',
      icon: '/src/assets/camly.png'
    },
    { 
      symbol: 'BTCB', 
      name: 'Bitcoin BEP20', 
      address: '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 
      type: 'BEP20', 
      decimals: 18, 
      apiId: 'BTCUSDT',
      icon: '/src/assets/btcb.png'
    }
  ],
  ETH: [
    { 
      symbol: 'ETH', 
      name: 'Ethereum', 
      type: 'NATIVE', 
      decimals: 18, 
      apiId: 'ETHUSDT',
      icon: '/src/assets/ethereum.png'
    }
  ]
};

export const NETWORKS: Record<'BSC' | 'ETH', NetworkConfig> = {
  BSC: {
    chainId: 56,
    name: 'BSC',
    icon: '/src/assets/bnb-chain.png',
    tokens: TOKENS.BSC
  },
  ETH: {
    chainId: 1,
    name: 'Ethereum',
    icon: '/src/assets/ethereum.png',
    tokens: TOKENS.ETH
  }
};
