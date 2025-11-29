import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Copy, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCryptoPrices } from "@/hooks/useCryptoPrices";
import { TOKENS } from "@/config/tokens";
import { formatUnits } from "viem";

export const WalletHeader = () => {
  const { address, connector, chain } = useAccount();
  const { user } = useAuth();
  const { disconnect } = useDisconnect();
  const { data: prices } = useCryptoPrices();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied!");
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Fetch balances for all tokens on current chain
  const network = chain?.id === 56 ? 'BSC' : chain?.id === 1 ? 'ETH' : 'BSC';
  const tokens = TOKENS[network as 'BSC' | 'ETH'] || TOKENS.BSC;

  // Get native token balance
  const { data: nativeBalance } = useBalance({
    address: address as `0x${string}`,
  });

  // Calculate total balance in USD
  const calculateTotalBalance = () => {
    if (!prices || !nativeBalance) return 0;

    let total = 0;

    // Add native token balance
    const nativeToken = tokens.find(t => t.type === 'NATIVE');
    if (nativeToken && prices[nativeToken.symbol]) {
      const balance = parseFloat(formatUnits(nativeBalance.value, nativeToken.decimals));
      total += balance * prices[nativeToken.symbol];
    }

    return total;
  };

  const totalBalance = calculateTotalBalance();

  const handleDisconnect = () => {
    disconnect();
    toast.success("Wallet disconnected");
  };

  return (
    <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-xl p-6 mb-6 shadow-lg border border-accent/20">
      <div className="flex items-center gap-4 mb-4">
        <Avatar className="h-16 w-16 border-2 border-accent">
          <AvatarImage src={profile?.avatar_url || undefined} />
          <AvatarFallback className="bg-accent text-accent-foreground text-xl">
            {profile?.username?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-primary-foreground">
            {profile?.username || "User"}
          </h2>
          {address && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-primary-foreground/80">
                {connector?.name || "Account 1"}
              </span>
              <button
                onClick={copyAddress}
                className="flex items-center gap-1 text-xs text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                {formatAddress(address)}
                <Copy className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Total Balance */}
      <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 border border-accent/30">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm text-primary-foreground/70">Total Balance</p>
          <Button
            onClick={handleDisconnect}
            variant="outline"
            size="sm"
            className="border-destructive text-destructive hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Disconnect
          </Button>
        </div>
        <p className="text-4xl font-bold text-accent">
          $ {totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
