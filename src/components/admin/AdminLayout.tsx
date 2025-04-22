
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Package, Users, Tags, Image, LayoutDashboard } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      path: "/admin"
    },
    {
      name: "Products",
      icon: <Package className="h-5 w-5" />,
      path: "/admin/products"
    },
    {
      name: "Categories",
      icon: <Tags className="h-5 w-5" />,
      path: "/admin/categories"
    },
    {
      name: "Banners",
      icon: <Image className="h-5 w-5" />,
      path: "/admin/banners"
    },
    {
      name: "Users",
      icon: <Users className="h-5 w-5" />,
      path: "/admin/users"
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/admin" className="font-semibold text-lg">Admin Panel</Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.name} to={item.path}>
              <Button 
                variant={location.pathname === item.path ? "secondary" : "ghost"} 
                className="w-full justify-start"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Website
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-10 bg-white border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <Link 
              key={item.name} 
              to={item.path}
              className={`flex flex-col items-center p-2 ${
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-gray-600"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h1 className="text-xl font-semibold">{title || "Admin"}</h1>
          {description && (
            <p className="text-sm text-gray-500 ml-4">{description}</p>
          )}
        </header>
        <main className="flex-1 overflow-y-auto p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
