
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, 
  DialogTrigger, DialogDescription
} from "@/components/ui/dialog";
import { Eye, EyeOff, Search } from "lucide-react";
import { format } from "date-fns";

export default function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
        
        // Load users
        await loadUsers();
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Error loading user data");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAndLoadData();
  }, [user, navigate]);

  const loadUsers = async () => {
    try {
      // Get profiles which includes user metadata from auth
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;
      
      setUsers(profiles || []);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error loading users");
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    return (
      (user.full_name && user.full_name.toLowerCase().includes(search)) || 
      (user.email && user.email.toLowerCase().includes(search)) ||
      (user.phone && user.phone.toLowerCase().includes(search))
    );
  });

  if (!user || !isAdmin) return null;

  return (
    <AdminLayout title="Users" description="View registered users">
      <div className="mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Registered Users</h1>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users by name, email or phone..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Birthday</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.full_name || "—"}</TableCell>
                  <TableCell>{user.phone || "—"}</TableCell>
                  <TableCell>
                    {user.birthday 
                      ? format(new Date(user.birthday), 'MMM dd, yyyy')
                      : "—"
                    }
                  </TableCell>
                  <TableCell>
                    {user.created_at 
                      ? format(new Date(user.created_at), 'MMM dd, yyyy')
                      : "—"
                    }
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => viewUserDetails(user)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedUser && (
        <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
              <DialogDescription>
                Information about {selectedUser.full_name || "this user"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                  <p>{selectedUser.full_name || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{selectedUser.phone || "—"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Birthday</h3>
                  <p>
                    {selectedUser.birthday 
                      ? format(new Date(selectedUser.birthday), 'MMMM dd, yyyy')
                      : "—"
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">User ID</h3>
                  <p className="text-xs text-muted-foreground truncate">{selectedUser.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Registered On</h3>
                  <p>
                    {selectedUser.created_at 
                      ? format(new Date(selectedUser.created_at), 'MMMM dd, yyyy')
                      : "—"
                    }
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                  <p>
                    {selectedUser.updated_at 
                      ? format(new Date(selectedUser.updated_at), 'MMMM dd, yyyy')
                      : "—"
                    }
                  </p>
                </div>
              </div>
              
              {selectedUser.address && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                  <p>{selectedUser.address}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
}
