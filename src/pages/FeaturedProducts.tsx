
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api/supabase";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedProducts() {
  // Fetch featured products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', { featured: true }],
    queryFn: () => fetchProducts({
      featured: true,
      sort_by: "created_at",
      sort_order: "desc"
    })
  });

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-pythronix-blue">Home</a> {" / "}
          <span className="text-gray-700">Featured Products</span>
        </div>
        
        {/* Page title */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 font-heading">Our Featured Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our handpicked selection of the best IoT components and devices available
          </p>
        </div>
        
        {/* Products section */}
        <div className="mb-8">
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
              <h3 className="text-lg font-medium mb-2">No featured products available</h3>
              <p className="text-gray-500">
                Check back later for our featured products
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
        
        <div className="flex justify-center mt-12">
          <Button asChild>
            <Link to="/products">
              See All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
