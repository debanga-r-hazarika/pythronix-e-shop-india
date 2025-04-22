
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function SavedAddresses() {
  const { user } = useAuth();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    address_line: "",
    city: "",
    state: "",
    postal_code: "",
  });

  const { data: addresses, refetch } = useQuery({
    queryKey: ["saved-addresses"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_addresses")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("saved_addresses")
        .insert({
          ...newAddress,
          user_id: user?.id,
        });

      if (error) throw error;
      
      await refetch();
      setIsAddingAddress(false);
      setNewAddress({ address_line: "", city: "", state: "", postal_code: "" });
      toast.success("Address added successfully");
    } catch (error) {
      toast.error("Error adding address");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Saved Addresses</h2>
        <Dialog open={isAddingAddress} onOpenChange={setIsAddingAddress}>
          <DialogTrigger asChild>
            <Button>Add New Address</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Address</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddAddress} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="address_line" className="text-sm font-medium">Address</label>
                <Input
                  id="address_line"
                  value={newAddress.address_line}
                  onChange={(e) => setNewAddress({ ...newAddress, address_line: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="text-sm font-medium">City</label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="text-sm font-medium">State</label>
                <Input
                  id="state"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="postal_code" className="text-sm font-medium">Postal Code</label>
                <Input
                  id="postal_code"
                  value={newAddress.postal_code}
                  onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddingAddress(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Address</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-4">
        {addresses?.map((address) => (
          <div key={address.id} className="border p-4 rounded-lg">
            <p className="font-medium">{address.address_line}</p>
            <p className="text-sm text-gray-600">
              {address.city}, {address.state} {address.postal_code}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
