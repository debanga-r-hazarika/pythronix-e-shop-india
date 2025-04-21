
import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import ProductCard from "@/components/product/ProductCard";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const [activeTab, setActiveTab] = useState("featured");
  
  const featuredProducts = products.filter(product => product.featured);
  const newProducts = products.filter(product => product.isNew);
  const saleProducts = products.filter(product => product.onSale);
  
  return (
    <section className="py-16">
      <div className="container">
        <div className="mb-10 flex flex-col items-center text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Discover Our Products
          </h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Find high-quality IoT components for your next project. From Arduino boards to sensors and modules.
          </p>
        </div>
        
        <Tabs defaultValue="featured" className="w-full">
          <div className="flex justify-center">
            <TabsList className="mb-8">
              <TabsTrigger value="featured" onClick={() => setActiveTab("featured")}>
                Featured
              </TabsTrigger>
              <TabsTrigger value="new" onClick={() => setActiveTab("new")}>
                New Arrivals
              </TabsTrigger>
              <TabsTrigger value="sale" onClick={() => setActiveTab("sale")}>
                On Sale
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="featured" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="new" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {newProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="sale" className="mt-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {saleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 flex justify-center">
          <Button asChild>
            <Link to="/products">
              View All Products <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
