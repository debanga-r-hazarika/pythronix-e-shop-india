
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogFooter 
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  
  // Form state
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function checkAdminAndLoadData() {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        
        // Check if user is admin
        const { data: adminCheck, error: adminError } = await supabase.rpc('is_admin', { user_id: user.id });
        if (adminError) throw adminError;
        
        if (!adminCheck) {
          toast.error("You don't have permission to access this page");
          navigate("/");
          return;
        }
        
        setIsAdmin(true);
        
        // Load categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading categories:", error);
        toast.error("Error loading categories");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadData();
  }, [user, navigate]);

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setDescription(category.description || "");
    setOpenDialog(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingCategory(null);
  };

  const handleOpenChange = (open) => {
    setOpenDialog(open);
    if (!open) resetForm();
  };

  const handleNew = () => {
    resetForm();
    setOpenDialog(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setSaving(true);
      
      if (editingCategory) {
        // Update existing category
        const { data, error } = await supabase
          .from('categories')
          .update({ name, description })
          .eq('id', editingCategory.id)
          .select();
          
        if (error) throw error;
        
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? data[0] : c
        ));
        toast.success("Category updated successfully");
      } else {
        // Create new category
        const { data, error } = await supabase
          .from('categories')
          .insert({ name, description })
          .select();
          
        if (error) throw error;
        
        setCategories([...categories, data[0]]);
        toast.success("Category created successfully");
      }
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Error saving category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Products in this category will be uncategorized.')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setCategories(categories.filter(category => category.id !== id));
      toast.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Error deleting category");
    }
  };

  if (!user || !isAdmin) return null;

  return (
    <AdminLayout title="Categories" description="Manage your product categories">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Dialog open={openDialog} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={handleNew}>
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Category Name</label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter category name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter category description"
                  rows={3}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Category"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : categories.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground mb-4">No categories found</p>
          <Button onClick={handleNew}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Category
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="max-w-md truncate">{category.description || "—"}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(category)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(category.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
