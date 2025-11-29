import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import LeftSidebar from "@/components/layout/LeftSidebar";
import { AddressBook } from "@/components/wallet/AddressBook";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-feed-bg flex flex-col">
      <Header />
      
      <div className="flex flex-1 pt-16">
        <LeftSidebar />

        <main className="flex-1 ml-[280px] p-6 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Feed
          </Button>

          <Card className="p-6 border-2 border-accent/20 shadow-xl bg-gradient-to-br from-card via-card to-primary/5">
            <h1 className="text-3xl font-bold text-foreground mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Wallet Settings
            </h1>
            
            <AddressBook />
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
