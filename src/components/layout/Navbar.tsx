
import { useState } from "react";
import { Link } from "react-router-dom";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SearchIcon, ShoppingCart, User, Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-heading text-pythronix-blue">Pythronix</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className="text-sm font-medium transition-colors hover:text-pythronix-blue"
            >
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center text-sm font-medium transition-colors hover:text-pythronix-blue">
                Categories
              </button>
              <div className="absolute left-0 top-full hidden w-64 pt-2 group-hover:block z-50">
                <div className="rounded-md border bg-white shadow-md">
                  {categories.map((category) => (
                    <DropdownMenu key={category.id}>
                      <DropdownMenuTrigger asChild>
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-pythronix-gray">
                          {category.name}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {category.subcategories?.map((subcategory) => (
                          <DropdownMenuItem key={subcategory.id}>
                            <Link
                              to={`/category/${subcategory.slug}`}
                              className="w-full"
                            >
                              {subcategory.name}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
              </div>
            </div>
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

        {/* Search Bar */}
        {!isMobile && (
          <div className="hidden md:flex md:w-1/3 lg:w-1/4 relative">
            <Input 
              placeholder="Search products..." 
              className="pl-8 pr-4"
            />
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
        )}

        {/* Right Side Icons */}
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

          <Button variant="ghost" size="icon" aria-label="Search">
            <SearchIcon className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Account">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link to="/login" className="w-full">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/register" className="w-full">Register</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" aria-label="Shopping Cart">
            <Link to="/cart">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-pythronix-blue text-[10px] font-medium text-white">
                  0
                </span>
              </div>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && mobileMenuOpen && (
        <div className="container pb-4">
          <div className="relative mb-4">
            <Input 
              placeholder="Search products..." 
              className="pl-8 pr-4"
            />
            <SearchIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          </div>
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
                {categories.map((category) => (
                  <div key={category.id}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                    <div className="ml-4 mt-1 flex flex-col space-y-1">
                      {category.subcategories?.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/category/${subcategory.slug}`}
                          className="text-xs text-muted-foreground"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
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
            <div className="h-px bg-border" />
            <Link
              to="/login"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
