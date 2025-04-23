
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

const TAX_RATE = 0.12; // Example 12% GST

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [promo, setPromo] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchCart();
  // eslint-disable-next-line
  }, [user]);

  async function fetchCart() {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq("user_id", user.id);
    if (error) {
      toast.error("Error loading your cart");
      setCartItems([]);
      setLoading(false);
      return;
    }
    setCartItems(data || []);
    setLoading(false);
  }

  const handleQtyChange = async (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    if (newQty === item.quantity) return;

    if (newQty > item.product.stock) {
      toast.error("Not enough stock!");
      return;
    }
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQty })
      .eq("id", item.id);
    if (!error) fetchCart();
    else toast.error("Can't update quantity");
  };

  const handleRemove = async (id) => {
    const { error } = await supabase.from("cart_items").delete().eq("id", id);
    if (!error) {
      toast.success("Item removed");
      setCartItems(cartItems => cartItems.filter((c) => c.id !== id));
    } else toast.error("Error removing item");
  };

  const handleWishlist = async (productId) => {
    if (!user) return;
    const { error } = await supabase.from("wishlists").insert([{ product_id: productId, user_id: user.id }]);
    if (!error) toast.success("Saved for later!");
    else toast.error("Error saving for later");
  };

  // Cart Calculation
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const taxes = subtotal * TAX_RATE;
  const shipping = subtotal === 0 ? 0 : subtotal >= 2000 ? 0 : 59;
  const total = subtotal + taxes + shipping;

  const estimatedDelivery = shipping === 0 ? "2-5 business days" : "3-7 business days";

  const handlePromo = () => {
    setApplyingPromo(true);
    setTimeout(() => {
      setApplyingPromo(false);
      toast.success("Sorry, promo codes are not functional in demo.");
    }, 700);
  };

  const handleCheckout = () => {
    // Here you would normally proceed to checkout
    // For this demo, we'll just show a success message
    toast.success("Proceeding to checkout...");
  };

  if (!user) return null;

  return (
    <MainLayout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : cartItems.length === 0 ? (
          <div className="text-center border rounded-lg py-20">
            <h2 className="text-lg font-semibold mb-2">Your cart is empty</h2>
            <Link to="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row items-center gap-4 border-b pb-4"
                >
                  {/* Product Image */}
                  <img
                    src={item.product?.image_url || "/placeholder.svg"}
                    alt={item.product?.name}
                    className="h-24 w-24 object-contain rounded border"
                  />
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{item.product?.name}</h3>
                    <p className="text-gray-500">{item.product?.description}</p>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <span>
                        {item.product?.stock > 0
                          ? `In Stock (${item.product?.stock})`
                          : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                      </span>
                    </div>
                  </div>
                  {/* Controls */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQtyChange(item, -1)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        className="w-12 mx-2 text-center"
                        min={1}
                        max={item.product?.stock}
                        value={item.quantity}
                        onChange={(e) => {
                          const value = Math.max(1, Math.min(item.product?.stock, Number(e.target.value)));
                          supabase
                            .from("cart_items")
                            .update({ quantity: value })
                            .eq("id", item.id)
                            .then(fetchCart);
                        }}
                        aria-label="Quantity"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleQtyChange(item, 1)}
                        disabled={item.quantity >= item.product?.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive flex items-center w-full"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Remove
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center w-full"
                      onClick={() => handleWishlist(item.product?.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" /> Save for later
                    </Button>
                  </div>
                  {/* Item Price */}
                  <div className="min-w-[80px] text-right">
                    <span className="block font-semibold text-lg">
                      ₹{(item.product?.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                    {item.product?.original_price && (
                      <span className="block text-xs text-gray-500 line-through">
                        ₹{item.product?.original_price.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* Cart Summary */}
            <div className="w-full max-w-sm border rounded-lg bg-white shadow-sm p-6 space-y-6 sticky top-24 self-start">
              <h2 className="font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes (GST)</span>
                  <span>₹{taxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? "Free"
                      : `₹${shipping.toLocaleString("en-IN")}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs text-muted-foreground mb-2">
                  Estimated delivery: {estimatedDelivery}
                </span>
                <Input
                  placeholder="Promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  disabled={applyingPromo}
                />
                <Button
                  size="sm"
                  className="mt-2"
                  disabled={applyingPromo || !promo}
                  onClick={handlePromo}
                >
                  {applyingPromo ? "Applying..." : "Apply"}
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
                  </Button>
                </Link>
                <Button
                  className="w-full bg-pythronix-blue hover:bg-pythronix-dark-blue"
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
