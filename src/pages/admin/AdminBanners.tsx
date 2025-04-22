import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import BannerForm from "@/components/admin/BannerForm";
import { Button } from "@/components/ui/button";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBanners() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [view, setView] = useState("table");

  useEffect(() => {
    async function checkAdminAndLoadData() {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is admin directly from user_roles table
        const { data: adminRole, error: adminError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        
        if (adminError) throw adminError;
        
        if (!adminRole) {
          toast.error("You don't have permission to access this page");
          navigate("/");
          return;
        }
        
        setIsAdmin(true);
        
        // Load banners
        await loadBanners();
      } catch (error) {
        console.error("Error loading banners:", error);
        toast.error("Error loading banners");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadData();
  }, [user, navigate]);

  const loadBanners = async () => {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .order('priority', { ascending: true });
      
    if (error) {
      console.error("Error loading banners:", error);
      toast.error("Error loading banners");
      return;
    }
    
    setBanners(data || []);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setBanners(banners.filter(banner => banner.id !== id));
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Error deleting banner");
    }
  };

  const handleBannerSaved = (savedBanner, isNew) => {
    if (isNew) {
      setBanners([...banners, savedBanner]);
    } else {
      setBanners(banners.map(b => b.id === savedBanner.id ? savedBanner : b));
    }
    setOpenDialog(false);
    setEditingBanner(null);
  };

  const toggleActivation = async (id, currentActive) => {
    try {
      const { error } = await supabase
        .from('banners')
        .update({ active: !currentActive })
        .eq('id', id);
        
      if (error) throw error;
      
      setBanners(banners.map(banner => 
        banner.id === id ? { ...banner, active: !currentActive } : banner
      ));
      
      toast.success(`Banner ${!currentActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error toggling banner activation:", error);
      toast.error("Error updating banner");
    }
  };

  const changePriority = async (id, direction) => {
    const index = banners.findIndex(banner => banner.id === id);
    if ((direction === 'up' && index === 0) || 
        (direction === 'down' && index === banners.length - 1)) {
      return;
    }
    
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const swapBanner = banners[swapIndex];
    const currentBanner = banners[index];
    
    try {
      const updates = [
        { id: currentBanner.id, priority: swapBanner.priority },
        { id: swapBanner.id, priority: currentBanner.priority }
      ];
      
      // Update both banners with new priorities
      for (const update of updates) {
        const { error } = await supabase
          .from('banners')
          .update({ priority: update.priority })
          .eq('id', update.id);
          
        if (error) throw error;
      }
      
      // Update local state
      const newBanners = [...banners];
      [newBanners[index], newBanners[swapIndex]] = [newBanners[swapIndex], newBanners[index]];
      setBanners(newBanners);
      
    } catch (error) {
      console.error("Error updating banner priority:", error);
      toast.error("Error updating banner priority");
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <AdminLayout title="Banners" description="Manage your promotional banners">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Banners</h1>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingBanner(null)}>
                <Plus className="mr-2 h-4 w-4" /> Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBanner ? "Edit Banner" : "Add New Banner"}
                </DialogTitle>
              </DialogHeader>
              <BannerForm 
                banner={editingBanner} 
                onSaved={handleBannerSaved} 
              />
            </DialogContent>
          </Dialog>
        </div>
        
        <Tabs value={view} onValueChange={setView} className="w-full">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : banners.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground mb-4">No banners found</p>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Banner
          </Button>
        </div>
      ) : view === "table" ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Active</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {banners.map((banner) => (
                <TableRow key={banner.id}>
                  <TableCell className="font-medium">{banner.title}</TableCell>
                  <TableCell>
                    {banner.image_url && (
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className="h-16 w-24 object-cover rounded"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <Switch 
                      checked={banner.active} 
                      onCheckedChange={() => toggleActivation(banner.id, banner.active)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => changePriority(banner.id, 'up')}
                        disabled={banners.indexOf(banner) === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span>{banner.priority}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => changePriority(banner.id, 'down')} 
                        disabled={banners.indexOf(banner) === banners.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(banner)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-destructive" 
                        onClick={() => handleDelete(banner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-6">
          {banners.filter(banner => banner.active).map((banner) => (
            <Card key={banner.id} className="relative overflow-hidden">
              <Button 
                variant="outline" 
                size="icon" 
                className="absolute top-2 right-2 z-10 bg-white"
                onClick={() => handleEdit(banner)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <h3 className="mb-2 text-2xl font-bold font-heading text-gray-900">
                    {banner.title}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {banner.subtitle || "No subtitle"}
                  </p>
                  <Button>
                    {banner.button_text}
                  </Button>
                </div>
                <div className="aspect-[4/3] w-full md:w-2/5">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">No image</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
          
          {banners.filter(banner => banner.active).length === 0 && (
            <div className="text-center py-10 border rounded-lg">
              <p className="text-muted-foreground">No active banners to preview</p>
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
