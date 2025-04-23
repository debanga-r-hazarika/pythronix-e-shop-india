
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductById, addToWishlist, removeFromWishlist } from "@/lib/api/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  CreditCard,
  Truck,
  ArrowLeft,
  Heart,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const { user } = useAuth();
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProductById(id),
    enabled: !!id
  });
  
  const handleAddToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to your wishlist");
      return;
    }

    try {
      setIsAddingToWishlist(true);
      await addToWishlist(user.id, id);
      toast.success("Added to wishlist");
    } catch (err) {
      toast.error("Failed to add to wishlist");
      console.error(err);
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error("Please login to add items to your cart");
      return;
    }

    if (product?.stock <= 0) {
      toast.error("Item is out of stock");
      return;
    }

    try {
      setIsAddingToCart(true);
      
      // Check if item already exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', id)
        .maybeSingle();

      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        
        if (newQuantity > product.stock) {
          toast.error(`Cannot add more than ${product.stock} items due to stock limitations`);
          setIsAddingToCart(false);
          return;
        }
        
        const { error } = await supabase
          .from('cart_items')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingItem.id);

        if (error) throw error;
        toast.success("Item quantity updated in cart");
      } else {
        // Add new item if it doesn't exist
        const { error } = await supabase
          .from('cart_items')
          .insert([
            { 
              user_id: user.id, 
              product_id: id, 
              quantity 
            }
          ]);

        if (error) throw error;
        toast.success("Item added to cart");
      }
    } catch (err) {
      toast.error("Failed to add item to cart");
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error("Please login to buy this item");
      return;
    }
    
    try {
      await handleAddToCart();
      // Navigate to checkout page
      window.location.href = "/cart";
    } catch (err) {
      console.error("Error with buy now:", err);
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const specifications = product?.specifications ? 
    (typeof product.specifications === 'string' ? 
      JSON.parse(product.specifications as string) : product.specifications) : {};
      
  const packageIncludes = product?.package_includes ? 
    (typeof product.package_includes === 'string' ? 
      JSON.parse(product.package_includes as string) : product.package_includes) : [];
      
  const allImages = product 
    ? [product.image_url, ...(JSON.parse(product.additional_images as string || '[]') || [])].filter(Boolean) 
    : [];

  const allCategories = product 
    ? [
        product.category, 
        ...(product.secondary_categories?.map(sc => sc.category) || [])
      ] 
    : [];

  const prevImage = () => {
    setSelectedImageIndex((current) => 
      current === 0 ? allImages.length - 1 : current - 1
    );
  };
  
  const nextImage = () => {
    setSelectedImageIndex((current) => 
      current === allImages.length - 1 ? 0 : current + 1
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="aspect-square bg-gray-200 rounded"></div>
              <div>
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }
  
  if (error || !product) {
    return (
      <MainLayout>
        <div className="container py-16 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-6">
            <a href="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
            </a>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-pythronix-blue">Home</a> {" / "}
          <a href="/products" className="hover:text-pythronix-blue">Products</a> {" / "}
          {allCategories.map((category, index) => (
            <>
              <a 
                key={category.id} 
                href={`/products?category=${category.id}`} 
                className="hover:text-pythronix-blue"
              >
                {category.name}
              </a> 
              {index < allCategories.length - 1 && " / "}
            </>
          ))}
          <span className="text-gray-700">{product.name}</span>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-white">
              <img
                src={allImages[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                className="h-full w-full object-contain"
              />
              
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/70 hover:bg-white"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-4 grid grid-cols-5 gap-2">
              {allImages.map((img, index) => (
                <div
                  key={index}
                  className={`aspect-square cursor-pointer overflow-hidden rounded-md border ${
                    selectedImageIndex === index ? "ring-2 ring-pythronix-blue" : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${product.name} - view ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">{product.name}</h1>
            
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < 4
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                4.0 (12 reviews)
              </span>
            </div>
            
            <div className="mt-4 flex items-center">
              <span className="text-3xl font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.original_price && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
              {product.original_price && (
                <span className="ml-3 text-sm font-medium text-green-600">
                  Save {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                </span>
              )}
            </div>
            
            <div className="mt-4 text-gray-600">
              <p>{product.description}</p>
            </div>
            
            <div className="mt-6 flex items-center">
              <span className="text-sm font-medium text-gray-900">Availability:</span>
              <span className={`ml-2 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
              </span>
            </div>
            
            <div className="mt-6">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                Quantity
              </label>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="h-9 w-9 rounded-l-md border border-r-0 bg-gray-100 flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={product.stock === 0}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setQuantity(Math.min(product.stock, Math.max(1, val)));
                  }}
                  className="h-9 w-16 border text-center"
                  disabled={product.stock === 0}
                />
                <button
                  type="button"
                  className="h-9 w-9 rounded-r-md border border-l-0 bg-gray-100 flex items-center justify-center"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={product.stock === 0}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button 
                className="flex-1" 
                disabled={product.stock === 0 || isAddingToCart} 
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700" 
                disabled={product.stock === 0 || isAddingToCart} 
                onClick={handleBuyNow}
              >
                <CreditCard className="mr-2 h-4 w-4" /> 
                {isAddingToCart ? "Processing..." : "Buy Now"}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-8 rounded-lg border p-4">
              <div className="flex items-start space-x-3">
                <div className="rounded-full bg-pythronix-gray p-2">
                  <Truck className="h-5 w-5 text-pythronix-blue" />
                </div>
                <div>
                  <h4 className="font-medium">Fast Delivery</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Free shipping on orders over ₹2,000. Delivery in 2-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16">
          <Tabs defaultValue="specifications">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="package">Package Includes</TabsTrigger>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              {Object.keys(specifications).length > 0 ? (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-left">
                    <tbody>
                      {Object.entries(specifications).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-b-0">
                          <th className="p-4 text-sm font-medium bg-gray-50">{key}</th>
                          <td className="p-4 text-sm text-gray-600">{value as string}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No specifications available for this product.</p>
              )}
            </TabsContent>
            
            <TabsContent value="package" className="mt-6">
              {packageIncludes.length > 0 ? (
                <div className="rounded-lg border p-6">
                  <h3 className="text-lg font-semibold mb-4">Package Includes:</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {packageIncludes.map((item, index) => (
                      <li key={index} className="text-gray-700">{item}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No package information available for this product.</p>
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <div className="mt-4 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < 4
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      Based on 12 reviews
                    </span>
                  </div>
                  <Button className="mt-4" onClick={() => toast.success("Review form coming soon!")}>Write a Review</Button>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer reviews will display here. This is a placeholder for demonstration purposes.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Shipping Information</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    We ship to all major cities in India. Orders are typically processed within 24 hours and dispatched the next business day. Delivery times vary by location:
                  </p>
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
                    <li>Metro Cities: 2-3 business days</li>
                    <li>Tier 2 Cities: 3-5 business days</li>
                    <li>Other Locations: 5-7 business days</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Return Policy</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    If you're not satisfied with your purchase, we accept returns within 30 days of delivery. Items must be in original packaging and unused condition.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetail;
