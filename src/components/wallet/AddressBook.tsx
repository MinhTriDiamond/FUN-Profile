import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";

export const AddressBook = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [formData, setFormData] = useState({
    contact_name: "",
    contact_wallet_address: "",
    network: "BSC"
  });

  const { data: contacts, isLoading } = useQuery({
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

  const addMutation = useMutation({
    mutationFn: async (contact: typeof formData) => {
      if (!user?.id) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("wallet_contacts")
        .insert({
          user_id: user.id,
          contact_name: contact.contact_name,
          contact_wallet_address: contact.contact_wallet_address,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_contacts"] });
      toast.success("Contact added successfully!");
      setIsAddOpen(false);
      setFormData({ contact_name: "", contact_wallet_address: "", network: "BSC" });
    },
    onError: () => {
      toast.error("Failed to add contact");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("wallet_contacts")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet_contacts"] });
      toast.success("Contact deleted successfully!");
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contact_name || !formData.contact_wallet_address) {
      toast.error("Please fill in all fields");
      return;
    }
    addMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading contacts...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-foreground">Address Book</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Contact</DialogTitle>
              <DialogDescription>Add a wallet address to your address book</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  placeholder="Contact name"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Network</Label>
                <Select value={formData.network} onValueChange={(v) => setFormData({ ...formData, network: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BSC">BSC (Binance Smart Chain)</SelectItem>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Wallet Address</Label>
                <Input
                  placeholder="0x..."
                  value={formData.contact_wallet_address}
                  onChange={(e) => setFormData({ ...formData, contact_wallet_address: e.target.value })}
                />
              </div>
              <Button type="submit" className="w-full" disabled={addMutation.isPending}>
                {addMutation.isPending ? "Adding..." : "Add Contact"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {contacts && contacts.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No contacts yet. Add your first contact!</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {contacts?.map((contact) => (
            <Card key={contact.id} className="p-4 hover:bg-accent/5 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{contact.contact_name}</h3>
                  <p className="text-sm text-muted-foreground font-mono">
                    {contact.contact_wallet_address}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {contact.contact_name}? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(contact.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
