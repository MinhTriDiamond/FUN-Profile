import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import bnbLogo from "@/assets/bnb.png";
import usdtLogo from "@/assets/usdt.png";
import camlyLogo from "@/assets/camly.png";

interface Token {
  symbol: string;
  name: string;
  balance: string;
  usdValue: string;
  icon: string;
  contract?: string;
}

export const AssetsTab = () => {
  const [network, setNetwork] = useState<"ethereum" | "bsc">("bsc");

  const tokens: Token[] = [
    {
      symbol: "BNB",
      name: "BNB Chain",
      balance: "2.1500",
      usdValue: "650.00",
      icon: bnbLogo,
    },
    {
      symbol: "USDT",
      name: "Tether USD (BEP20)",
      balance: "1,000.00",
      usdValue: "1,000.00",
      icon: usdtLogo,
    },
    {
      symbol: "CAMLY",
      name: "CAMLY COIN (BEP20)",
      balance: "50,000.00",
      usdValue: "2,500.00",
      icon: camlyLogo,
      contract: "0x0910320181889fefde0bb1ca63962b0a8882e413",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Network Switcher */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-foreground">Network:</label>
        <Select value={network} onValueChange={(v) => setNetwork(v as "ethereum" | "bsc")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ethereum">Ethereum</SelectItem>
            <SelectItem value="bsc">BSC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Token List */}
      <div className="space-y-2">
        {tokens.map((token) => (
          <Card
            key={token.symbol}
            className="p-4 hover:bg-accent/5 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center overflow-hidden">
                  <img src={token.icon} alt={token.symbol} className="h-8 w-8 object-contain" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{token.symbol}</p>
                  <p className="text-sm text-muted-foreground">{token.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-semibold text-foreground">{token.balance}</p>
                  <p className="text-sm text-muted-foreground">$ {token.usdValue}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
