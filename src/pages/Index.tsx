import MainLayout from "@/components/layout/MainLayout";
import HeroSection from "@/components/home/HeroSection";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import PromotionalBanners from "@/components/home/PromotionalBanners";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Award, Clock, Truck } from "lucide-react";

const Index = () => {
  return (
    <MainLayout>
      <HeroSection />
      
      {/* Features */}
      <section className="py-10 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-pythronix-gray p-3">
                <Truck className="h-6 w-6 text-pythronix-blue" />
              </div>
              <div>
                <h3 className="font-medium">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over ₹2,000</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-pythronix-gray p-3">
                <Clock className="h-6 w-6 text-pythronix-blue" />
              </div>
              <div>
                <h3 className="font-medium">Same-Day Dispatch</h3>
                <p className="text-sm text-muted-foreground">Order before 2 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-pythronix-gray p-3">
                <Package className="h-6 w-6 text-pythronix-blue" />
              </div>
              <div>
                <h3 className="font-medium">Secure Packaging</h3>
                <p className="text-sm text-muted-foreground">Safe & secure delivery</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="rounded-full bg-pythronix-gray p-3">
                <Award className="h-6 w-6 text-pythronix-blue" />
              </div>
              <div>
                <h3 className="font-medium">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">30 days return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FeaturedProducts />
      
      <PromotionalBanners />
      
      {/* Newsletter */}
      <section className="py-16 bg-pythronix-blue text-white">
        <div className="container">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold font-heading">Stay Updated</h2>
            <p className="mt-3 max-w-2xl">
              Subscribe to our newsletter for exclusive offers, new product arrivals, and IoT project ideas.
            </p>
            <div className="mt-6 flex w-full max-w-md flex-col space-y-4 sm:flex-row sm:space-x-3 sm:space-y-0">
              <input
                type="email"
                placeholder="Your email address"
                className="rounded-md border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 flex-1"
              />
              <Button className="bg-white text-pythronix-blue hover:bg-gray-100">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
