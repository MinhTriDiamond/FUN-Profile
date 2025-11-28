import { useState } from "react";
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
import Header from "@/components/Header";
import LeftSidebar from "@/components/LeftSidebar";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Wallet = () => {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState("assets");
  const navigate = useNavigate();

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
            <Card className="p-12 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-6">
                Connect your Web3 wallet to access the ultimate wallet experience
              </p>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <WalletHeader />

              <Card className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="assets">Assets</TabsTrigger>
                    <TabsTrigger value="receive">Receive</TabsTrigger>
                    <TabsTrigger value="send">Send</TabsTrigger>
                    <TabsTrigger value="history">History</TabsTrigger>
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
