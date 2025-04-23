
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "@/lib/api/supabase";
import MainLayout from "@/components/layout/MainLayout";
import ProductCard from "@/components/product/ProductCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Filter, X } from "lucide-react";

// Define a type for our filter props
interface FilterProps {
  categories: any[];
  categoryId: string | null;
  setCategoryId: (id: string | null) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  inStock: boolean | null;
  setInStock: (inStock: boolean | null) => void;
  maxPrice: number;
  sortBy?: string;
  setSortBy?: (sortBy: string) => void;
  sortOrder?: string;
  setSortOrder?: (sortOrder: string) => void;
  clearFilters: () => void;
  minPriceValue: string;
  setMinPriceValue: (value: string) => void;
  maxPriceValue: string;
  setMaxPriceValue: (value: string) => void;
  applyPriceFilter: () => void;
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [categoryId, setCategoryId] = useState<string | null>(searchParams.get('category'));
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minPriceValue, setMinPriceValue] = useState<string>("0");
  const [maxPriceValue, setMaxPriceValue] = useState<string>("1000");
  const [inStock, setInStock] = useState<boolean | null>(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showFilters, setShowFilters] = useState(false);
  
  // Get all categories for the filter
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (categoryId) {
      params.set('category', categoryId);
    } else {
      params.delete('category');
    }
    
    setSearchParams(params);
  }, [categoryId, setSearchParams]);
  
  // Get filtered products
  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products', { categoryId, priceRange, inStock, sortBy, sortOrder }],
    queryFn: () => fetchProducts({
      category_id: categoryId,
      min_price: priceRange[0],
      max_price: priceRange[1],
      in_stock: inStock,
      sort_by: sortBy,
      sort_order: sortOrder
    })
  });
  
  // Apply price filter when user inputs custom values
  const applyPriceFilter = () => {
    const min = parseInt(minPriceValue) || 0;
    const max = parseInt(maxPriceValue) || maxPrice;
    setPriceRange([min, max]);
  };
  
  // Clear all filters
  const clearFilters = () => {
    setCategoryId(null);
    setPriceRange([0, maxPrice || 1000]);
    setMinPriceValue("0");
    setMaxPriceValue(maxPrice ? maxPrice.toString() : "1000");
    setInStock(null);
    setSortBy("created_at");
    setSortOrder("desc");
  };

  // Get max price for the slider
  const [maxPrice, setMaxPrice] = useState(1000);
  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(
        ...products.map(p => p.original_price || p.price)
      );
      setMaxPrice(Math.ceil(highestPrice / 100) * 100);
      if (priceRange[1] === 1000) {
        setPriceRange([0, highestPrice]);
        setMaxPriceValue(highestPrice.toString());
      }
    }
  }, [products]);
  
  // Update slider when input fields change
  useEffect(() => {
    const handlePriceRangeChange = () => {
      setMinPriceValue(priceRange[0].toString());
      setMaxPriceValue(priceRange[1].toString());
    };
    handlePriceRangeChange();
  }, [priceRange]);

  return (
    <MainLayout>
      <div className="container py-8">
        {/* Breadcrumbs */}
        <div className="mb-6 text-sm text-gray-500">
          <a href="/" className="hover:text-pythronix-blue">Home</a> {" / "}
          <span className="text-gray-700">Products</span>
        </div>
        
        <div className="flex flex-col space-y-4">
          {/* Page Title and Filter Toggle */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 font-heading">Products</h1>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center md:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" /> Filters
            </Button>
          </div>
          
          {/* Main content with filters and products */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filters - Mobile */}
            {showFilters && (
              <div className="md:hidden bg-white p-4 border rounded-lg shadow-sm">
                <div className="flex items-center justify-between pb-4 border-b">
                  <h2 className="font-semibold">Filters</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="py-4">
                  <MobileFilters 
                    categories={categories} 
                    categoryId={categoryId}
                    setCategoryId={setCategoryId} 
                    priceRange={priceRange}
                    setPriceRange={setPriceRange}
                    inStock={inStock}
                    setInStock={setInStock}
                    maxPrice={maxPrice}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    clearFilters={clearFilters}
                    minPriceValue={minPriceValue}
                    setMinPriceValue={setMinPriceValue}
                    maxPriceValue={maxPriceValue}
                    setMaxPriceValue={setMaxPriceValue}
                    applyPriceFilter={applyPriceFilter}
                  />
                </div>
              </div>
            )}
            
            {/* Filters - Desktop */}
            <div className="hidden md:block">
              <div className="bg-white p-4 border rounded-lg shadow-sm sticky top-24">
                <h2 className="font-semibold border-b pb-2 mb-4">Filters</h2>
                <DesktopFilters 
                  categories={categories} 
                  categoryId={categoryId}
                  setCategoryId={setCategoryId} 
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  inStock={inStock}
                  setInStock={setInStock}
                  maxPrice={maxPrice}
                  clearFilters={clearFilters}
                  minPriceValue={minPriceValue}
                  setMinPriceValue={setMinPriceValue}
                  maxPriceValue={maxPriceValue}
                  setMaxPriceValue={setMaxPriceValue}
                  applyPriceFilter={applyPriceFilter}
                />
              </div>
            </div>
            
            {/* Product Grid */}
            <div className="md:col-span-3">
              {/* Sort options */}
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  {products.length} products
                </div>
                
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sort-by" className="text-sm whitespace-nowrap">Sort by:</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="created_at">Newest</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-[60px]">
                      <SelectValue placeholder="Order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Asc</SelectItem>
                      <SelectItem value="desc">Desc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Products */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
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
                <div className="py-20 text-center border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Mobile Filters Component
const MobileFilters = ({ 
  categories, categoryId, setCategoryId, priceRange, setPriceRange,
  inStock, setInStock, maxPrice, sortBy, setSortBy,
  sortOrder, setSortOrder, clearFilters, minPriceValue, setMinPriceValue,
  maxPriceValue, setMaxPriceValue, applyPriceFilter
}: FilterProps) => {
  return (
    <div className="space-y-6">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-categories" 
                  checked={categoryId === null}
                  onCheckedChange={() => setCategoryId(null)}
                />
                <Label htmlFor="all-categories" className="text-sm">
                  All Categories
                </Label>
              </div>
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={categoryId === category.id}
                    onCheckedChange={() => setCategoryId(categoryId === category.id ? null : category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`} className="text-sm">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              <div>
                <Slider
                  value={priceRange}
                  min={0}
                  max={maxPrice}
                  step={1}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-6"
                />
              </div>
              <div className="flex items-center justify-between space-x-2">
                <div className="w-full">
                  <Label htmlFor="min-price-mobile" className="text-xs mb-1 block">Min Price</Label>
                  <Input 
                    id="min-price-mobile"
                    type="number"
                    value={minPriceValue}
                    onChange={(e) => setMinPriceValue(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="w-full">
                  <Label htmlFor="max-price-mobile" className="text-xs mb-1 block">Max Price</Label>
                  <Input 
                    id="max-price-mobile"
                    type="number"
                    value={maxPriceValue}
                    onChange={(e) => setMaxPriceValue(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full" 
                onClick={applyPriceFilter}
              >
                Apply Price
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="availability">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="all-availability" 
                  checked={inStock === null}
                  onCheckedChange={() => setInStock(null)}
                />
                <Label htmlFor="all-availability" className="text-sm">
                  All Products
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="in-stock" 
                  checked={inStock === true}
                  onCheckedChange={() => setInStock(inStock === true ? null : true)}
                />
                <Label htmlFor="in-stock" className="text-sm">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="out-of-stock" 
                  checked={inStock === false}
                  onCheckedChange={() => setInStock(inStock === false ? null : false)}
                />
                <Label htmlFor="out-of-stock" className="text-sm">
                  Out of Stock
                </Label>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button variant="outline" size="sm" onClick={clearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};

// Desktop Filters Component
const DesktopFilters = ({ 
  categories, categoryId, setCategoryId, priceRange, setPriceRange,
  inStock, setInStock, maxPrice, clearFilters, minPriceValue, setMinPriceValue,
  maxPriceValue, setMaxPriceValue, applyPriceFilter
}: FilterProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-medium">Categories</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-categories-desktop" 
              checked={categoryId === null}
              onCheckedChange={() => setCategoryId(null)}
            />
            <Label htmlFor="all-categories-desktop" className="text-sm">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`category-desktop-${category.id}`} 
                checked={categoryId === category.id}
                onCheckedChange={() => setCategoryId(categoryId === category.id ? null : category.id)}
              />
              <Label htmlFor={`category-desktop-${category.id}`} className="text-sm">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Price Range</h3>
        <div className="space-y-6">
          <div>
            <Slider
              value={priceRange}
              min={0}
              max={maxPrice}
              step={1}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-6"
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <div className="w-full">
              <Label htmlFor="min-price" className="text-xs mb-1 block">Min Price</Label>
              <Input 
                id="min-price"
                type="number" 
                value={minPriceValue}
                onChange={(e) => setMinPriceValue(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full">
              <Label htmlFor="max-price" className="text-xs mb-1 block">Max Price</Label>
              <Input 
                id="max-price"
                type="number" 
                value={maxPriceValue}
                onChange={(e) => setMaxPriceValue(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={applyPriceFilter}
          >
            Apply Price
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Availability</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="all-availability-desktop" 
              checked={inStock === null}
              onCheckedChange={() => setInStock(null)}
            />
            <Label htmlFor="all-availability-desktop" className="text-sm">
              All Products
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="in-stock-desktop" 
              checked={inStock === true}
              onCheckedChange={() => setInStock(inStock === true ? null : true)}
            />
            <Label htmlFor="in-stock-desktop" className="text-sm">
              In Stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="out-of-stock-desktop" 
              checked={inStock === false}
              onCheckedChange={() => setInStock(inStock === false ? null : false)}
            />
            <Label htmlFor="out-of-stock-desktop" className="text-sm">
              Out of Stock
            </Label>
          </div>
        </div>
      </div>
      
      <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
        Clear All Filters
      </Button>
    </div>
  );
};
