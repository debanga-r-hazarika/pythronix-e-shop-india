
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2, Plus, X } from "lucide-react";

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
  const [categoryId, setCategoryId] = useState(product?.category_id || "null");
  const [featured, setFeatured] = useState(product?.featured || false);
  const [isNew, setIsNew] = useState(product?.is_new || false);
  const [onSale, setOnSale] = useState(product?.on_sale || false);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(product?.image_url || "");
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
      
      // Upload image if selected
      if (image) {
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
          
        updatedImageUrl = publicUrl;
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
      
      const productData = {
        name,
        description,
        price: parseFloat(price),
        original_price: originalPrice ? parseFloat(originalPrice) : null,
        stock: parseInt(stock.toString()),
        category_id: categoryId === "null" ? null : categoryId,
        featured,
        is_new: isNew,
        on_sale: onSale,
        image_url: updatedImageUrl || null,
        specifications: Object.keys(specsObj).length > 0 ? JSON.stringify(specsObj) : null,
        package_includes: filteredPackageIncludes.length > 0 ? JSON.stringify(filteredPackageIncludes) : null,
      };
      
      let result;
      
      if (product) {
        // Update existing product
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
        toast.success("Product created successfully");
      }
      
      onSaved(result, !product);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Error saving product");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl("");
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
            <Label htmlFor="category">Category</Label>
            <Select 
              value={categoryId} 
              onValueChange={setCategoryId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">None</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

      <div className="space-y-2">
        <Label>Product Image</Label>
        {(imageUrl || image) ? (
          <div className="relative w-full aspect-video bg-muted rounded-md overflow-hidden">
            <img 
              src={image ? URL.createObjectURL(image) : imageUrl} 
              alt="Product preview" 
              className="w-full h-full object-contain"
            />
            <Button 
              type="button" 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2"
              onClick={handleRemoveImage}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Input 
              type="file" 
              id="image" 
              className="hidden" 
              onChange={handleImageChange} 
              accept="image/*"
            />
            <Label htmlFor="image" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">Click to upload an image</span>
            </Label>
          </div>
        )}
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
