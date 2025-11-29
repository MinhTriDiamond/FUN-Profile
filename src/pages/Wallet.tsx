import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { AssetsTab } from "@/components/wallet/AssetsTab";
import { ReceiveTab } from "@/components/wallet/ReceiveTab";
import { SendTab } from "@/components/wallet/SendTab";
import { HistoryTab } from "@/components/wallet/HistoryTab";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { toast } from "sonner";

const Wallet = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("assets");
  const navigate = useNavigate();
  const { playSound } = useSoundEffects();
  const [wasConnected, setWasConnected] = useState(false);

  // Play coin drop sound when wallet connects
  useEffect(() => {
    if (isConnected && !wasConnected) {
      playSound('coinDrop');
      toast.success("Wallet connected successfully! 💰✨", {
        description: "Your wallet is now connected to FUN Profile",
      });
    }
    setWasConnected(isConnected);
  }, [isConnected, wasConnected, playSound]);

  return (
    <div className="min-h-screen bg-feed-bg flex flex-col">
      <Header />
      
      <div className="flex flex-1 pt-16">
        {/* Left Sidebar */}
        <LeftSidebar />

        {/* Main Wallet Area */}
        <main className="flex-1 ml-[280px] p-6 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>

          {!isConnected ? (
            <Card className="p-12 text-center bg-gradient-to-br from-primary/5 via-accent/5 to-primary/10 border-2 border-accent/30 shadow-2xl animate-glow">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <Sparkles className="h-20 w-20 text-accent animate-sparkle" />
                  <div className="absolute inset-0 bg-accent/20 blur-2xl animate-pulse" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Connect your Web3 wallet to access the ultimate wallet experience ✨
              </p>
              <div className="flex justify-center">
                <div className="transform hover:scale-105 transition-transform">
                  <ConnectButton />
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <WalletHeader />

              <Card className="p-6 border-2 border-accent/20 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6 bg-secondary/50 p-1">
                    <TabsTrigger value="assets" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      Assets
                    </TabsTrigger>
                    <TabsTrigger value="receive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      Receive
                    </TabsTrigger>
                    <TabsTrigger value="send" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      Send
                    </TabsTrigger>
                    <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                      History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="assets">
                    <AssetsTab />
                  </TabsContent>

                  <TabsContent value="receive">
                    <ReceiveTab />
                  </TabsContent>

                  <TabsContent value="send">
                    <SendTab />
                  </TabsContent>

                  <TabsContent value="history">
                    <HistoryTab />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Wallet;
