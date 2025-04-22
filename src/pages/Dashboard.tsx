
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileSection from "@/components/dashboard/ProfileSection";
import OrderHistory from "@/components/dashboard/OrderHistory";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <Card className="mt-4 p-4">
          <TabsContent value="profile">
            <ProfileSection />
          </TabsContent>
          <TabsContent value="orders">
            <OrderHistory />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
}
