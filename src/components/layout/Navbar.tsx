import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { fetchCategories } from "@/lib/api/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SearchIcon, ShoppingCart, User, Menu, X, LogOut, Settings } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: cartCount = 0 } = useQuery({
    queryKey: ['cartCount'],
    queryFn: async () => {
      if (!user) return 0;
      
      const { data, error, count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching cart count:", error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!user,
    refetchOnWindowFocus: true
  });

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
          
        if (error) {
          console.error("Error checking admin status:", error);
          return;
        }
        
        setIsAdmin(!!data);
      } catch (error) {
        console.error("Error checking admin status:", error);
      }
    }
    
    checkAdminStatus();
  }, [user]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-heading text-pythronix-blue">Pythronix</span>
          </Link>
        </div>

        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-pythronix-blue"
            >
              Home
            </Link>
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium transition-colors hover:text-pythronix-blue bg-transparent">
                    Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 w-[600px]">
                      {categoriesLoading ? (
                        <div className="col-span-3 text-center py-4">Loading categories...</div>
                      ) : categories.length === 0 ? (
                        <div className="col-span-3 text-center py-4">No categories found</div>
                      ) : (
                        categories.map((category) => (
                          <Link
                            key={category.id}
                            to={`/products?category=${category.id}`}
                            className="block p-2 rounded-md hover:bg-muted"
                          >
                            <div className="text-sm font-medium">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {category.description.length > 50 
                                  ? category.description.substring(0, 50) + '...' 
                                  : category.description
                                }
                              </div>
                            )}
                          </Link>
                        ))
                      )}
                      
                      <div className="col-span-3 border-t mt-2 pt-2">
                        <Link
                          to="/categories"
                          className="block p-2 text-center text-sm text-pythronix-blue hover:underline"
                        >
                          View All Categories
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link
              to="/products"
              className="text-sm font-medium transition-colors hover:text-pythronix-blue"
            >
              All Products
            </Link>
            <Link
              to="/sale"
              className="text-sm font-medium text-red-500 transition-colors hover:text-red-400"
            >
              Sale
            </Link>
          </nav>
        )}

        {!isMobile && (
          <form onSubmit={handleSearch} className="hidden md:flex md:w-1/3 lg:w-1/4 relative">
            <Input 
              placeholder="Search products..." 
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
        )}

        <div className="flex items-center space-x-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          )}

          {isMobile && (
            <Button 
              variant="ghost"
              size="icon"
              aria-label="Search"
              onClick={() => setMobileMenuOpen(true)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem>
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem>
                      <Link to="/admin" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem>
                  <Link to="/auth" className="w-full">Sign In</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <Link to="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pythronix-blue text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {isMobile && mobileMenuOpen && (
        <div className="container pb-4">
          <form onSubmit={handleSearch} className="relative mb-4">
            <Input 
              placeholder="Search products..." 
              className="pl-8 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground">
              <SearchIcon className="h-4 w-4" />
            </button>
          </form>
          <nav className="flex flex-col space-y-4">
            <Link
              to="/"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <div>
              <span className="text-sm font-medium">Categories</span>
              <div className="ml-4 mt-2 flex flex-col space-y-2">
                {categoriesLoading ? (
                  <div className="text-sm text-muted-foreground">Loading categories...</div>
                ) : categories.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No categories found</div>
                ) : (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products?category=${category.id}`}
                      className="text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))
                )}
                <Link
                  to="/categories"
                  className="text-sm text-pythronix-blue"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  View All Categories
                </Link>
              </div>
            </div>
            <Link
              to="/products"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              All Products
            </Link>
            <Link
              to="/sale"
              className="text-sm font-medium text-red-500"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sale
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin Panel
              </Link>
            )}
            <div className="h-px bg-border" />
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-medium text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth?tab=register"
                  className="text-sm font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
