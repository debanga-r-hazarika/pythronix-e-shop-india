
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserWishlist, removeFromWishlist } from "@/lib/api/supabase";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

export default function WishlistItems() {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const data = await fetchUserWishlist(user.id);
      setWishlistItems(data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await removeFromWishlist(user.id, productId);
      toast.success("Removed from wishlist");
      loadWishlist();
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      toast.error("Failed to remove from wishlist");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex rounded-lg border p-4">
            <div className="h-20 w-20 bg-gray-200 rounded mr-4"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-muted-foreground mb-4">
            Browse products and add items to your wishlist
          </p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">My Wishlist ({wishlistItems.length} items)</h3>
      
      {wishlistItems.map((item) => (
        <div key={item.product_id} className="flex items-center rounded-lg border p-4">
          <Link to={`/product/${item.product_id}`} className="flex-shrink-0">
            <img 
              src={item.product?.image_url || "/placeholder.svg"} 
              alt={item.product?.name} 
              className="h-20 w-20 object-contain rounded" 
            />
          </Link>
          
          <div className="ml-4 flex-1">
            <Link to={`/product/${item.product_id}`}>
              <h4 className="font-medium hover:text-pythronix-blue">
                {item.product?.name}
              </h4>
            </Link>
            
            <div className="mt-1 text-lg font-semibold">
              {item.product?.price && formatPrice(item.product.price)}
            </div>
            
            <div className="mt-2 flex space-x-2">
              <Button size="sm" className="h-8">
                <ShoppingCart className="mr-1 h-3 w-3" /> Add to Cart
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8"
                onClick={() => handleRemoveFromWishlist(item.product_id)}
              >
                <Trash2 className="mr-1 h-3 w-3" /> Remove
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
