import { useQuery } from "@tanstack/react-query";
import { TOKENS } from "@/config/tokens";

interface PriceData {
  [symbol: string]: number;
}

const fetchBinancePrice = async (apiId: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${apiId}`);
    const data = await response.json();
    return parseFloat(data.price);
  } catch (error) {
    console.error(`Error fetching Binance price for ${apiId}:`, error);
    return 0;
  }
};

const fetchDexScreenerPrice = async (address: string): Promise<number> => {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${address}`);
    const data = await response.json();
    if (data.pairs && data.pairs.length > 0) {
      return parseFloat(data.pairs[0].priceUsd);
    }
    return 0;
  } catch (error) {
    console.error(`Error fetching DexScreener price for ${address}:`, error);
    return 0;
  }
};

export const useCryptoPrices = () => {
  return useQuery({
    queryKey: ["crypto-prices"],
    queryFn: async (): Promise<PriceData> => {
      const prices: PriceData = {};

      // Fetch all BSC tokens
      for (const token of TOKENS.BSC) {
        if (token.price !== undefined) {
          // Fixed price (e.g., USDT = 1.00)
          prices[token.symbol] = token.price;
        } else if (token.apiId) {
          // Fetch from Binance
          prices[token.symbol] = await fetchBinancePrice(token.apiId);
        } else if (token.source === 'DEXSCREENER' && token.address) {
          // Fetch from DexScreener
          prices[token.symbol] = await fetchDexScreenerPrice(token.address);
        }
      }

      // Fetch all ETH tokens
      for (const token of TOKENS.ETH) {
        if (token.apiId) {
          prices[token.symbol] = await fetchBinancePrice(token.apiId);
        }
      }

      return prices;
    },
    refetchInterval: 60000, // Refetch every 60 seconds
    staleTime: 30000, // Consider data stale after 30 seconds
  });
};
