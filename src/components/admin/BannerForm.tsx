
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { UploadCloud, Trash2 } from "lucide-react";

interface BannerFormProps {
  banner?: any;
  onSaved: (banner: any, isNew: boolean) => void;
}

export default function BannerForm({ banner, onSaved }: BannerFormProps) {
  const [title, setTitle] = useState(banner?.title || "");
  const [subtitle, setSubtitle] = useState(banner?.subtitle || "");
  const [buttonText, setButtonText] = useState(banner?.button_text || "Learn More");
  const [link, setLink] = useState(banner?.link || "/");
  const [active, setActive] = useState(banner?.active !== false); // Default to true for new banners
  const [priority, setPriority] = useState(banner?.priority || 0);
  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>(banner?.image_url || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !link) {
      toast.error("Title and link are required");
      return;
    }

    if (!imageUrl && !image) {
      toast.error("Banner image is required");
      return;
    }

    setLoading(true);

    try {
      let updatedImageUrl = imageUrl;
      
      // Upload image if selected
      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `banners/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        
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
      
      const bannerData = {
        title,
        subtitle,
        button_text: buttonText,
        link,
        active,
        priority: parseInt(priority.toString()),
        image_url: updatedImageUrl,
      };
      
      let result;
      
      if (banner) {
        // Update existing banner
        const { data, error } = await supabase
          .from('banners')
          .update(bannerData)
          .eq('id', banner.id)
          .select();
          
        if (error) throw error;
        result = data[0];
        toast.success("Banner updated successfully");
      } else {
        // Create new banner
        const { data, error } = await supabase
          .from('banners')
          .insert(bannerData)
          .select();
          
        if (error) throw error;
        result = data[0];
        toast.success("Banner created successfully");
      }
      
      onSaved(result, !banner);
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Error saving banner");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Banner Title</Label>
          <Input 
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter banner title"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle (Optional)</Label>
          <Textarea 
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Enter banner subtitle"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="button-text">Button Text</Label>
            <Input 
              id="button-text"
              value={buttonText}
              onChange={(e) => setButtonText(e.target.value)}
              placeholder="Learn More"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="link">Button Link</Label>
            <Input 
              id="link"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="/products"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="priority">Display Priority</Label>
            <Input 
              id="priority"
              type="number"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value))}
              placeholder="0"
              min="0"
            />
            <p className="text-xs text-muted-foreground">Lower numbers display first</p>
          </div>
          
          <div className="flex items-center space-x-2 h-10 mt-8">
            <Switch 
              id="active" 
              checked={active} 
              onCheckedChange={setActive}
            />
            <Label htmlFor="active">Active Banner</Label>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Banner Image</Label>
        {(imageUrl || image) ? (
          <div className="relative w-full aspect-[2/1] bg-muted rounded-md overflow-hidden">
            <img 
              src={image ? URL.createObjectURL(image) : imageUrl} 
              alt="Banner preview" 
              className="w-full h-full object-cover"
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
              id="banner-image" 
              className="hidden" 
              onChange={handleImageChange} 
              accept="image/*"
            />
            <Label htmlFor="banner-image" className="cursor-pointer flex flex-col items-center">
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <span className="mt-2 text-sm text-gray-600">Click to upload an image</span>
              <span className="mt-1 text-xs text-gray-500">(Recommended size: 1200×600px)</span>
            </Label>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Saving..." : banner ? "Update Banner" : "Create Banner"}
      </Button>
    </form>
  );
}
