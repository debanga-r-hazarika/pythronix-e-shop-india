
import { useState } from "react";
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { products } from "@/lib/data";
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
  ArrowLeft
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  
  // Find the product with matching ID
  const product = products.find((p) => p.id === id);
  
  // If product not found, show error
  if (!product) {
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

  // Format price to INR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  return (
    <MainLayout>
      <div className="container py-12">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-pythronix-blue">Home</a> {" / "}
          <a href="/products" className="hover:text-pythronix-blue">Products</a> {" / "}
          <span className="text-gray-700">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-lg border bg-white p-4">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-heading">{product.name}</h1>
            
            {/* Rating */}
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="mt-4 flex items-center">
              <span className="text-3xl font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="ml-3 text-lg text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="ml-3 text-sm font-medium text-green-600">
                  Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            
            {/* Description */}
            <div className="mt-4 text-gray-600">
              <p>{product.description}</p>
            </div>
            
            {/* Stock Status */}
            <div className="mt-6 flex items-center">
              <span className="text-sm font-medium text-gray-900">Availability:</span>
              <span className={`ml-2 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : "Out of Stock"}
              </span>
            </div>
            
            {/* Quantity Selector */}
            <div className="mt-6">
              <label htmlFor="quantity" className="text-sm font-medium text-gray-900">
                Quantity
              </label>
              <div className="mt-2 flex items-center">
                <button
                  type="button"
                  className="h-9 w-9 rounded-l-md border border-r-0 bg-gray-100 flex items-center justify-center"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
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
                />
                <button
                  type="button"
                  className="h-9 w-9 rounded-r-md border border-l-0 bg-gray-100 flex items-center justify-center"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <Button className="flex-1" disabled={product.stock === 0}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={product.stock === 0}>
                <CreditCard className="mr-2 h-4 w-4" /> Buy Now
              </Button>
            </div>
            
            {/* Delivery Info */}
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
        
        {/* Product Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications">
            <TabsList className="w-full justify-start border-b">
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Customer Reviews</TabsTrigger>
              <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
            </TabsList>
            <TabsContent value="specifications" className="mt-6">
              {product.specifications ? (
                <div className="overflow-hidden rounded-lg border">
                  <table className="w-full text-left">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b last:border-b-0">
                          <th className="p-4 text-sm font-medium bg-gray-50">{key}</th>
                          <td className="p-4 text-sm text-gray-600">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-gray-600">No specifications available for this product.</p>
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
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                      Based on {product.reviewCount} reviews
                    </span>
                  </div>
                  <Button className="mt-4">Write a Review</Button>
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
