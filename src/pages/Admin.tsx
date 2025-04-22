
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, Tags, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        // Check if user is admin directly from user_roles table
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (error) throw error;
        
        // If no admin role found, redirect to home
        if (!data) {
          toast.error("You don't have permission to access the admin panel");
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast.error("Error checking admin permissions");
        navigate("/");
      }
    }

    checkAdmin();
  }, [user, navigate]);

  if (!user) return null;

  const adminModules = [
    {
      title: "Products",
      description: "Manage your products inventory",
      icon: <Package className="h-12 w-12 text-primary" />,
      link: "/admin/products"
    },
    {
      title: "Categories",
      description: "Manage product categories",
      icon: <Tags className="h-12 w-12 text-primary" />,
      link: "/admin/categories"
    },
    {
      title: "Banners",
      description: "Manage promotional banners",
      icon: <Image className="h-12 w-12 text-primary" />,
      link: "/admin/banners"
    },
    {
      title: "Users",
      description: "View and manage registered users",
      icon: <Users className="h-12 w-12 text-primary" />,
      link: "/admin/users"
    }
  ];

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your entire website from one place</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adminModules.map((module) => (
          <Card key={module.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-2xl font-bold">{module.title}</CardTitle>
              {module.icon}
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm mt-2">{module.description}</CardDescription>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={module.link}>
                  Manage {module.title}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
