import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAccount } from "wagmi";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const WalletHeader = () => {
  const { address, connector } = useAccount();
  const { user } = useAuth();

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

  // Mock USD balance (in production, use real price feeds)
  const mockUSDBalance = 1234.56;

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
        <p className="text-sm text-primary-foreground/70 mb-1">Total Balance</p>
        <p className="text-4xl font-bold text-accent">
          $ {mockUSDBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </div>
  );
};
