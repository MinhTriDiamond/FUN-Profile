import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { FlyingMoneyAnimation } from "./FlyingMoneyAnimation";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { Heart, CheckCircle } from "lucide-react";

export const SendTab = () => {
  const { user } = useAuth();
  const [token, setToken] = useState("ETH");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiverName, setReceiverName] = useState("");

  const { data: contacts } = useQuery({
    queryKey: ["wallet_contacts", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("wallet_contacts")
        .select("*")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

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

  useEffect(() => {
    if (receiver && contacts) {
      const contact = contacts.find(
        (c) => c.contact_wallet_address.toLowerCase() === receiver.toLowerCase()
      );
      if (contact) {
        setReceiverName(contact.contact_name);
      } else {
        setReceiverName("");
      }
    }
  }, [receiver, contacts]);

  const formatAmount = (value: string) => {
    // Support dot for thousands and comma for decimals
    const cleaned = value.replace(/[^\d.,]/g, "");
    return cleaned;
  };

  const handleReview = () => {
    if (!receiver || !amount) {
      toast.error("Please fill in all fields");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsSending(true);

    // Simulate blockchain transaction
    setTimeout(async () => {
      setIsSending(false);
      
      // Save to transaction history
      if (user?.id) {
        await supabase.from("transactions_history").insert({
          user_id: user.id,
          type: "send",
          amount: parseFloat(amount.replace(/\./g, "").replace(",", ".")),
          description: `Sent ${amount} ${token} to ${receiverName || receiver}`,
          tx_hash: "0x" + Math.random().toString(16).substring(2, 66),
        });
      }

      // Show success animation
      setShowSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#FFD700", "#FFA500", "#FF6347"],
      });

      setTimeout(() => {
        setShowSuccess(false);
        setReceiver("");
        setAmount("");
        setToken("ETH");
        toast.success("Transaction successful!");
      }, 3000);
    }, 3000);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Token Selector */}
        <div className="space-y-2">
          <Label>Token</Label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">ETH - Ethereum</SelectItem>
              <SelectItem value="BNB">BNB - Binance Coin</SelectItem>
              <SelectItem value="USDT">USDT - Tether</SelectItem>
              <SelectItem value="USDC">USDC - USD Coin</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="mt-1">
            Network: {token === "BNB" ? "BSC" : "Ethereum"}
          </Badge>
        </div>

        {/* Receiver */}
        <div className="space-y-2">
          <Label>Receiver Address</Label>
          <Input
            placeholder="0x... or search contact"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          {receiverName && (
            <p className="text-sm text-accent font-medium">📇 Contact: {receiverName}</p>
          )}
        </div>

        {/* Amount */}
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(formatAmount(e.target.value))}
          />
          <p className="text-xs text-muted-foreground">
            Use dot (.) for thousands, comma (,) for decimals
          </p>
        </div>

        {/* Action Button */}
        <Button onClick={handleReview} className="w-full" size="lg">
          Review Transaction
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Transaction</DialogTitle>
            <DialogDescription>Please review the details carefully</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token:</span>
              <span className="font-semibold">{token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">To:</span>
              <span className="font-semibold">{receiverName || receiver.slice(0, 10) + "..."}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-semibold text-accent">{amount} {token}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Network:</span>
              <Badge>{token === "BNB" ? "BSC" : "Ethereum"}</Badge>
            </div>
          </div>
          <Button onClick={handleConfirm} className="w-full" size="lg">
            Confirm & Send
          </Button>
        </DialogContent>
      </Dialog>

      {/* Flying Money Animation */}
      {isSending && (
        <FlyingMoneyAnimation
          senderAvatar={profile?.avatar_url || undefined}
          senderName={profile?.username || "You"}
          receiverName={receiverName || "Receiver"}
        />
      )}

      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="text-center">
          <div className="flex flex-col items-center gap-4 py-6">
            <CheckCircle className="h-20 w-20 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Success!</h2>
            <div className="flex gap-2 text-4xl">
              <Heart className="text-red-500 fill-red-500" />
              <Heart className="text-red-500 fill-red-500" />
              <Heart className="text-red-500 fill-red-500" />
            </div>
            <p className="text-muted-foreground">
              Your transaction was successful!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
