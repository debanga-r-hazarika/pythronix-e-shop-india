
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/supabase";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

export default function Sale() {
  // Fetch products that are on sale
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', { onSale: true }],
    queryFn: () => fetchProducts({
      on_sale: true,
      sort_by: "price",
      sort_order: "asc"
    })
  });

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <Link to="/" className="hover:text-pythronix-blue">Home</Link> {" / "}
          <span className="text-gray-700">Sale</span>
        </div>
        
        {/* Hero section for Sale */}
        <div className="py-12 px-6 bg-red-50 rounded-lg mb-12 text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4 font-heading">Special Offers & Discounts</h1>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Discover amazing deals on our IoT components and devices. Limited time offers on selected products.
          </p>
          <Button size="lg" className="bg-red-600 hover:bg-red-700" asChild>
            <Link to="#products">
              <ShoppingBag className="mr-2 h-5 w-5" />
              Shop Now
            </Link>
          </Button>
        </div>
        
        {/* Products section */}
        <div className="mb-8" id="products">
          <h2 className="text-2xl font-bold mb-6">Sale Products</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse border rounded-lg h-80 bg-gray-100">
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No sale products available</h3>
              <p className="text-gray-500">
                Check back later for new offers and discounts
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link to="/products">View All Products</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
