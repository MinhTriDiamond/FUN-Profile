import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { useAccount, useBalance, useReadContract } from "wagmi";
import { formatUnits } from "viem";
import { TOKENS, NETWORKS } from "@/config/tokens";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import bnbLogo from "@/assets/bnb.png";
import usdtLogo from "@/assets/usdt.png";
import camlyLogo from "@/assets/camly.png";
import btcbLogo from "@/assets/btcb.png";
import ethLogo from "@/assets/ethereum.png";
import bnbChainLogo from "@/assets/bnb-chain.png";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  contract?: string;
}

const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const AssetsTab = () => {
  const [network, setNetwork] = useState<"BSC" | "ETH">("BSC");
  const { address } = useAccount();
  const { data: prices } = useCryptoPrices();

  const tokens = TOKENS[network];
  const networkConfig = NETWORKS[network];

  // Get native token balance
  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}`,
  });

  const getTokenIcon = (symbol: string) => {
    switch(symbol) {
      case 'BNB': return bnbLogo;
      case 'USDT': return usdtLogo;
      case 'CAMLY': return camlyLogo;
      case 'BTCB': return btcbLogo;
      case 'ETH': return ethLogo;
      default: return bnbLogo;
    }
  };

  return (
    <div className="space-y-4">
      {/* Network Switcher */}
      <div className="flex items-center gap-3">
        <img src={networkConfig.icon} alt={networkConfig.name} className="h-6 w-6" />
        <label className="text-sm font-medium text-foreground">Network:</label>
        <Select value={network} onValueChange={(v) => setNetwork(v as "BSC" | "ETH")}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BSC">BSC (Binance Smart Chain)</SelectItem>
            <SelectItem value="ETH">Ethereum</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {tokens.map((token) => {
          const TokenBalanceCard = () => {
            let balance = "0.00";
            let usdValue = "0.00";

            if (token.type === 'NATIVE' && nativeBalance) {
              const bal = parseFloat(formatUnits(nativeBalance.value, token.decimals));
              balance = bal.toFixed(4);
              if (prices && prices[token.symbol]) {
                usdValue = (bal * prices[token.symbol]).toFixed(2);
              }
            } else if (token.address) {
              // For ERC20/BEP20 tokens, use useReadContract
              const { data: tokenBalance } = useReadContract({
                address: token.address as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
              });

              if (tokenBalance) {
                const bal = parseFloat(formatUnits(tokenBalance, token.decimals));
                balance = bal.toFixed(4);
                if (prices && prices[token.symbol]) {
                  usdValue = (bal * prices[token.symbol]).toFixed(2);
                }
              }
            }

            return (
              <Card
                key={token.symbol}
                className="p-4 hover:bg-accent/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                      <img src={getTokenIcon(token.symbol)} alt={token.symbol} className="h-8 w-8 object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{token.symbol}</p>
                      <p className="text-sm text-muted-foreground">{token.name}</p>
                      {token.address && (
                        <p className="text-xs text-muted-foreground/60 font-mono">
                          {token.address.slice(0, 6)}...{token.address.slice(-4)}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{balance}</p>
                      <p className="text-sm text-muted-foreground">$ {usdValue}</p>
                      {prices && prices[token.symbol] && (
                        <p className="text-xs text-accent">@ ${prices[token.symbol].toFixed(2)}</p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </div>
              </Card>
            );
          };

          return <TokenBalanceCard key={token.symbol} />;
        })}
      </div>
    </div>
  );
};
