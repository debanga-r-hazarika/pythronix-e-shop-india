
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  product?: any;
  categories: any[];
  onSaved: (product: any, isNew: boolean) => void;
}

export default function ProductForm({ product, categories, onSaved }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price || "");
  const [originalPrice, setOriginalPrice] = useState(product?.original_price || "");
  const [stock, setStock] = useState(product?.stock || 0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    product?.category_id ? [product.category_id] : []
  );
  const [featured, setFeatured] = useState(product?.featured || false);
  const [isNew, setIsNew] = useState(product?.is_new || false);
  const [onSale, setOnSale] = useState(product?.on_sale || false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(product?.image_url || "");
  
  // Multiple images support
  const [additionalImages, setAdditionalImages] = useState<File[]>([]);
  const [additionalImageUrls, setAdditionalImageUrls] = useState<string[]>(
    product?.additional_images ? JSON.parse(product.additional_images) : []
  );
  
  const [loading, setLoading] = useState(false);
  const [specifications, setSpecifications] = useState<{key: string, value: string}[]>(
    product?.specifications ? Object.entries(JSON.parse(product.specifications)).map(
      ([key, value]) => ({ key, value: value as string })
    ) : [{ key: "", value: "" }]
  );
  const [packageIncludes, setPackageIncludes] = useState<string[]>(
    product?.package_includes ? JSON.parse(product.package_includes) : [""]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      toast.error("Name and price are required");
      return;
    }

    setLoading(true);

    try {
      let updatedImageUrl = imageUrl;
      let updatedAdditionalImages = [...additionalImageUrls];
      
      // Upload main image if selected
      if (mainImage) {
        const fileExt = mainImage.name.split('.').pop();
        const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, mainImage);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);
          
        updatedImageUrl = publicUrl;
      }
      
      // Upload additional images if selected
      if (additionalImages.length > 0) {
        for (const image of additionalImages) {
          const fileExt = image.name.split('.').pop();
          const filePath = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(filePath, image);
            
          if (uploadError) throw uploadError;
          
          // Get the public URL for the uploaded image
          const { data: { publicUrl } } = supabase.storage
            .from('product-images')
            .getPublicUrl(filePath);
            
          updatedAdditionalImages.push(publicUrl);
        }
      }
      
      // Convert specifications array to object
      const specsObj = specifications
        .filter(spec => spec.key.trim() !== '' && spec.value.trim() !== '')
        .reduce((obj, spec) => {
          obj[spec.key] = spec.value;
          return obj;
        }, {});
        
      // Filter out empty package includes
      const filteredPackageIncludes = packageIncludes.filter(item => item.trim() !== '');
      
      // Get the primary category (first one in the list) or null if none selected
      const primaryCategoryId = selectedCategories.length > 0 ? selectedCategories[0] : null;
      
      const productData = {
        name,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock.toString()),
        category_id: primaryCategoryId,
        featured,
        is_new: isNew,
        on_sale: onSale,
        image_url: updatedImageUrl || null,
        additional_images: updatedAdditionalImages.length > 0 ? JSON.stringify(updatedAdditionalImages) : null,
        specifications: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : null,
        package_includes: filteredPackageIncludes.length > 0 ? JSON.stringify(filteredPackageIncludes) : null,
      };
      
      let result;
      let productId;
      
      if (product) {
        // Update existing product
        productId = product.id;
        const { data, error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id)
          .select();
          
        if (error) throw error;
        result = data[0];
        toast.success("Product updated successfully");
      } else {
        // Create new product
        const { data, error } = await supabase
          .from('products')
          .insert(productData)
          .select();
          
        if (error) throw error;
        result = data[0];
        productId = result.id;
        toast.success("Product created successfully");
      }
      
      // Handle product categories (all except the primary which is already stored in category_id)
      if (selectedCategories.length > 1) {
        // First remove existing product_categories for this product (except primary)
        await supabase
          .from('product_categories')
          .delete()
          .eq('product_id', productId);
        
        // Then insert new relationships for secondary categories
        const productCategoriesData = selectedCategories.slice(1).map(categoryId => ({
          product_id: productId,
          category_id: categoryId
        }));
        
        if (productCategoriesData.length > 0) {
          const { error: categoryError } = await supabase
            .from('product_categories')
            .insert(productCategoriesData);
            
          if (categoryError) {
            console.error("Error saving secondary categories:", categoryError);
            toast.error("Product saved but there was an error with secondary categories");
          }
        }
      }
      
      onSaved(result, !product);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
    }
  };
  
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAdditionalImages(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveMainImage = () => {
    setMainImage(null);
    setImageUrl("");
  };
  
  const handleRemoveAdditionalImage = (index: number, isUploaded: boolean) => {
    if (isUploaded) {
      // Remove uploaded image URL
      setAdditionalImageUrls(prev => prev.filter((_, i) => i !== index));
    } else {
      // Remove file from additionalImages state
      setAdditionalImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const addPackageItem = () => {
    setPackageIncludes([...packageIncludes, ""]);
  };

  const removePackageItem = (index: number) => {
    setPackageIncludes(packageIncludes.filter((_, i) => i !== index));
  };

  const updatePackageItem = (index: number, value: string) => {
    const newItems = [...packageIncludes];
    newItems[index] = value;
    setPackageIncludes(newItems);
  };
  
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      if (checked) {
        return [...prev, categoryId];
      } else {
        return prev.filter(id => id !== categoryId);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input 
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="original-price">Original Price ($)</Label>
              <Input 
                id="original-price"
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input 
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              placeholder="0"
              min="0"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Categories (Select one or more)</Label>
            <ScrollArea className="h-40 border rounded-md p-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2 py-1">
                  <Checkbox 
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked as boolean)
                    }
                  />
                  <Label 
                    htmlFor={`category-${category.id}`}
                    className="text-sm font-normal"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </ScrollArea>
            {selectedCategories.length === 0 && (
              <p className="text-xs text-red-500">Please select at least one category</p>
            )}
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="flex items-center space-x-2">
              <Switch 
                id="featured" 
                checked={featured} 
                onCheckedChange={setFeatured}
              />
              <Label htmlFor="featured">Featured Product</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="is-new" 
                checked={isNew} 
                onCheckedChange={setIsNew}
              />
              <Label htmlFor="is-new">Mark as New</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="on-sale" 
                checked={onSale} 
                onCheckedChange={setOnSale}
              />
              <Label htmlFor="on-sale">On Sale</Label>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Image */}
      <div className="space-y-2">
        <Label>Main Product Image</Label>
        {(imageUrl || mainImage) ? (
          <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={mainImage ? URL.createObjectURL(mainImage) : imageUrl} 
              alt="Product preview" 
              className="w-full h-full object-contain"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={handleRemoveMainImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Input 
              type="file" 
              id="mainImage" 
              className="hidden" 
              onChange={handleMainImageChange} 
              accept="image/*"
            />
            <Label htmlFor="mainImage" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">Click to upload main image</span>
            </Label>
          </div>
        )}
      </div>

      {/* Additional Images */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Additional Images (up to 5 total)</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={() => document.getElementById('additionalImages')?.click()}
            disabled={(additionalImages.length + additionalImageUrls.length) >= 5}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Images
          </Button>
          <Input 
            type="file" 
            id="additionalImages" 
            className="hidden" 
            onChange={handleAdditionalImagesChange} 
            accept="image/*"
            multiple
            disabled={(additionalImages.length + additionalImageUrls.length) >= 5}
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Display existing uploaded images */}
          {additionalImageUrls.map((url, index) => (
            <div key={`uploaded-${index}`} className="relative aspect-square bg-muted rounded-md overflow-hidden border">
              <img 
                src={url} 
                alt={`Additional image ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemoveAdditionalImage(index, true)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Display newly selected images */}
          {additionalImages.map((file, index) => (
            <div key={`new-${index}`} className="relative aspect-square bg-muted rounded-md overflow-hidden border">
              <img 
                src={URL.createObjectURL(file)}
                alt={`New image ${index + 1}`}
                className="w-full h-full object-contain"
              />
              <Button 
                type="button" 
                variant="destructive" 
                size="icon" 
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => handleRemoveAdditionalImage(index, false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 5 - additionalImageUrls.length - additionalImages.length) }).map((_, index) => (
            <div 
              key={`empty-${index}`} 
              className="aspect-square border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center"
              onClick={() => document.getElementById('additionalImages')?.click()}
            >
              <div className="text-gray-400 text-center cursor-pointer">
                <Plus className="h-6 w-6 mx-auto" />
                <span className="text-xs">Add Image</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {5 - additionalImageUrls.length - additionalImages.length} slots remaining
        </p>
      </div>

      {/* Package Includes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Package Includes</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addPackageItem}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        
        <div className="space-y-2">
          {packageIncludes.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item}
                onChange={(e) => updatePackageItem(index, e.target.value)}
                placeholder="e.g., 1 x Arduino Mega Original"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removePackageItem(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Specifications Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Specifications</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addSpecification}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Specification
          </Button>
        </div>
        
        <div className="space-y-2">
          {specifications.map((spec, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={spec.key}
                onChange={(e) => updateSpecification(index, "key", e.target.value)}
                placeholder="Name (e.g., Model)"
                className="w-1/3"
              />
              <Input
                value={spec.value}
                onChange={(e) => updateSpecification(index, "value", e.target.value)}
                placeholder="Value (e.g., Mega 2560)"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon"
                onClick={() => removeSpecification(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
