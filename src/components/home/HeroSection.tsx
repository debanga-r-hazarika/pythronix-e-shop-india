
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-pythronix-blue to-blue-600 py-16 text-white md:py-24">
      <div className="absolute inset-0 z-0 opacity-20">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern
              id="circuit-pattern"
              patternUnits="userSpaceOnUse"
              width="100"
              height="100"
              patternTransform="scale(2) rotate(0)"
            >
              <path
                d="M50,0 L50,100 M0,50 L100,50 M25,25 L75,75 M75,25 L25,75"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <circle cx="0" cy="0" r="3" fill="currentColor" />
              <circle cx="0" cy="100" r="3" fill="currentColor" />
              <circle cx="100" cy="0" r="3" fill="currentColor" />
              <circle cx="100" cy="100" r="3" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit-pattern)" />
        </svg>
      </div>
      
      <div className="container relative z-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
          <div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight font-heading md:text-5xl lg:text-6xl">
              Build Your <span className="text-yellow-300">Next IoT Project</span> with Pythronix
            </h1>
            <p className="mb-6 max-w-md text-lg text-blue-100 md:text-xl">
              Your one-stop shop for premium IoT components, Arduino boards, sensors, and electronic parts
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-pythronix-blue hover:bg-gray-100">
                <Link to="/products">Browse Products</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/featured">
                  Featured Items <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-blue-400 opacity-30 blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-blue-300 opacity-30 blur-3xl"></div>
            <img
              src="/placeholder.svg"
              alt="IoT Components"
              className="relative z-10 mx-auto h-auto max-w-full rounded-lg object-cover shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
