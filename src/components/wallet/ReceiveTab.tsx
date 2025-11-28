import { useAccount } from "wagmi";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export const ReceiveTab = () => {
  const { address } = useAccount();

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    }
  };

  if (!address) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please connect your wallet first</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      {/* QR Code */}
      <div className="bg-background p-6 rounded-xl border-2 border-primary shadow-lg">
        <QRCodeSVG
          value={address}
          size={256}
          bgColor="#ffffff"
          fgColor="#000000"
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Address Display */}
      <div className="w-full max-w-md space-y-2">
        <p className="text-sm font-medium text-center text-muted-foreground">
          Your Wallet Address
        </p>
        <div className="flex items-center gap-2 bg-muted p-3 rounded-lg">
          <code className="flex-1 text-sm break-all text-foreground font-mono">
            {address}
          </code>
          <Button
            variant="ghost"
            size="icon"
            onClick={copyAddress}
            className="shrink-0 hover:bg-accent"
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center max-w-md">
        <p className="text-sm text-muted-foreground">
          Scan the QR code or copy your address to receive tokens
        </p>
      </div>
    </div>
  );
};
