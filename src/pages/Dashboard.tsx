
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MainLayout from "@/components/layout/MainLayout";
import ProfileSection from "@/components/dashboard/ProfileSection";
import OrderHistory from "@/components/dashboard/OrderHistory";
import WishlistItems from "@/components/dashboard/WishlistItems";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>
          <Card className="mt-4 p-6">
            <TabsContent value="profile">
              <ProfileSection />
            </TabsContent>
            <TabsContent value="orders">
              <OrderHistory />
            </TabsContent>
            <TabsContent value="wishlist">
              <WishlistItems />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </MainLayout>
  );
}
