
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminProducts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    async function checkAdminAndLoadData() {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        setLoading(true);
        
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
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            secondary_categories:product_categories(category:categories(*))
          `)
          .order('created_at', { ascending: false });
          
        if (productsError) throw productsError;
        
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
          
        if (categoriesError) throw categoriesError;
        
        setProducts(productsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error loading admin data:", error);
        toast.error("Error loading data");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadData();
  }, [user, navigate]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product");
    }
  };

  const handleProductSaved = async (savedProduct, isNew) => {
    try {
      // Fetch the complete product data with categories
      const { data: refreshedProduct, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          secondary_categories:product_categories(category:categories(*))
        `)
        .eq('id', savedProduct.id)
        .single();
        
      if (error) throw error;
      
      if (isNew) {
        setProducts([refreshedProduct, ...products]);
      } else {
        setProducts(products.map(p => p.id === refreshedProduct.id ? refreshedProduct : p));
      }
    } catch (error) {
      console.error("Error refreshing product data:", error);
      // Fallback to using the saved product directly
      if (isNew) {
        setProducts([savedProduct, ...products]);
      } else {
        setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      }
    }
    
    setOpenDialog(false);
    setEditingProduct(null);
  };

  if (!user || !isAdmin) return null;

  return (
    <AdminLayout title="Products" description="Manage your product inventory">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <div className="max-h-[80vh] overflow-y-auto">
              <ProductForm 
                product={editingProduct} 
                categories={categories} 
                onSaved={handleProductSaved} 
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground mb-4">No products found</p>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Categories</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => {
                const allCategories = [];
                
                if (product.category) {
                  allCategories.push(product.category.name);
                }
                
                if (product.secondary_categories && Array.isArray(product.secondary_categories)) {
                  product.secondary_categories.forEach(sc => {
                    if (sc.category && sc.category.name) {
                      allCategories.push(sc.category.name);
                    }
                  });
                }
                
                const categoriesDisplay = allCategories.length > 0 
                  ? allCategories.join(", ") 
                  : "Uncategorized";
                
                return (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>${product.price}</TableCell>
                    <TableCell>{categoriesDisplay}</TableCell>
                    <TableCell>{product.stock}</TableCell>
                    <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
}
