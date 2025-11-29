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
import { Heart, CheckCircle, AlertCircle } from "lucide-react";
import { useAccount, useSendTransaction, useWriteContract, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";
import { TOKENS } from "@/config/tokens";

const ERC20_ABI = [
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export const SendTab = () => {
  const { user } = useAuth();
  const { address, chain } = useAccount();
  const { switchChain } = useSwitchChain();
  const { sendTransactionAsync } = useSendTransaction();
  const { writeContractAsync } = useWriteContract();
  
  const [token, setToken] = useState("BNB");
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [receiverName, setReceiverName] = useState("");

  const network = chain?.id === 56 ? 'BSC' : chain?.id === 1 ? 'ETH' : 'BSC';
  const tokens = TOKENS[network as 'BSC' | 'ETH'] || TOKENS.BSC;
  const selectedToken = tokens.find(t => t.symbol === token) || tokens[0];

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

    // Check if on correct network
    const requiredChainId = network === 'BSC' ? 56 : 1;
    if (chain?.id !== requiredChainId) {
      toast.error(`Please switch to ${network} network`);
      if (switchChain) {
        switchChain({ chainId: requiredChainId });
      }
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setIsSending(true);

    try {
      const amountValue = parseFloat(amount.replace(/\./g, "").replace(",", "."));
      const parsedAmount = parseUnits(amountValue.toString(), selectedToken.decimals);
      
      let txHash = "";

      if (selectedToken.type === 'NATIVE') {
        // Send native token (BNB or ETH)
        txHash = await sendTransactionAsync({
          to: receiver as `0x${string}`,
          value: parsedAmount,
        });
      } else if (selectedToken.address && address && chain) {
        // Send ERC20/BEP20 token
        txHash = await writeContractAsync({
          address: selectedToken.address as `0x${string}`,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [receiver as `0x${string}`, parsedAmount],
          account: address,
          chain,
        });
      }

      // Save to transaction history
      if (user?.id && txHash) {
        await supabase.from("transactions_history").insert({
          user_id: user.id,
          type: "send",
          amount: amountValue,
          description: `Sent ${amountValue} ${token} to ${receiverName || receiver}`,
          tx_hash: txHash,
        });
      }

      setIsSending(false);

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
        setToken(tokens[0].symbol);
        toast.success("Transaction successful!");
      }, 3000);
    } catch (error: any) {
      setIsSending(false);
      console.error("Transaction error:", error);
      toast.error(error?.message || "Transaction failed");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Network Warning */}
        {chain && ((network === 'BSC' && chain.id !== 56) || (network === 'ETH' && chain.id !== 1)) && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-destructive">Wrong Network</p>
              <p className="text-xs text-destructive/80">
                Please switch to {network} network to send this token
              </p>
            </div>
          </div>
        )}

        {/* Token Selector */}
        <div className="space-y-2">
          <Label>Token</Label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((t) => (
                <SelectItem key={t.symbol} value={t.symbol}>
                  {t.symbol} - {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="mt-1">
            Network: {network}
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
              <Badge>{network}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token Type:</span>
              <Badge variant="outline">{selectedToken.type}</Badge>
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
