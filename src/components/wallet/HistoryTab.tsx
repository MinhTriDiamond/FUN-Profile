import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { ExternalLink, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const HistoryTab = () => {
  const { user } = useAuth();

  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("transactions_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);
      return data || [];
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading transactions...</p>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No transaction history yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <Card key={tx.id} className="p-4 hover:bg-accent/5 transition-colors">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  tx.type === "send"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-accent/10 text-accent"
                }`}
              >
                {tx.type === "send" ? (
                  <ArrowUpRight className="h-5 w-5" />
                ) : (
                  <ArrowDownLeft className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="font-semibold text-foreground capitalize">{tx.type}</p>
                <p className="text-sm text-muted-foreground">{tx.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(tx.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold ${
                  tx.type === "send" ? "text-destructive" : "text-accent"
                }`}
              >
                {tx.type === "send" ? "-" : "+"} {tx.amount?.toLocaleString()}
              </p>
              {tx.tx_hash && (
                <a
                  href={`https://bscscan.com/tx/${tx.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                >
                  View on BscScan
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
