import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { X } from "lucide-react";

const Checkout = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [amount, setAmount] = useState(0); // For Razorpay (in paise)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Calculate items and total on load
  useEffect(() => {
    // 1. Check for "Buy Now" (Direct Purchase)
    if (location.state && location.state.product) {
      const { product, size } = location.state;
      const price = Number(product.price);
      setCartItems([{
        ...product,
        size: size,
        quantity: 1,
        // Ensure image is passed/preserved
        image: product.image
      }]);
      setTotalAmount(price);
      setAmount(price * 100); // Razorpay expects paise
    }
    // 2. Check for "Add to Cart" (Local Storage)
    else {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (storedCart.length > 0) {
        setCartItems(storedCart);
        calculateTotal(storedCart);
      } else {
        // No items
        setCartItems([]);
        setTotalAmount(0);
        setAmount(0);
      }
    }
  }, [location.state]);

  const calculateTotal = (items: any[]) => {
    const total = items.reduce((sum: number, item: any) => sum + (Number(item.price) * (item.quantity || 1)), 0);
    setTotalAmount(total);
    setAmount(total * 100);
  };

  const handleRemoveItem = (indexToRemove: number) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    calculateTotal(updatedCart);

    // If we are in "Cart Mode" (not Buy Now), update localStorage too
    if (!location.state) {
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      window.dispatchEvent(new Event("storage")); // Notify header
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePayment = async () => {
    // 1. Validate Cart
    if (cartItems.length === 0) {
      toast({
        title: "Cart is Empty",
        description: "Please add products to your cart first.",
        variant: "destructive"
      });
      return;
    }

    // 2. Validate Form
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      toast({
        title: "Missing Details",
        description: "Please fill in all the details before proceeding.",
        variant: "destructive"
      });
      return;
    }

    try {
      // 3. Create Order
      const orderData = await api.createOrder(amount);

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Zenstee",
        description: `Order for ${cartItems.length} Item(s)`,
        image: "/logo.png",
        order_id: orderData.id,
        handler: async function (response: any) {
          try {
            // Pass customer details along with payment response
            await api.verifyPayment({
              ...response,
              customerDetails: formData,
              amount: orderData.amount,
              items: cartItems // Send items to backend for order record
            });

            // Clear Cart if it was a Cart purchase (not Buy Now)
            if (!location.state) {
              localStorage.removeItem("cart");
              window.dispatchEvent(new Event("storage"));
            }

            toast({
              title: "Payment Successful! 🎉",
              description: "Thank you for shopping with Zenstee. Your order is confirmed.",
            });

            // Redirect or show success (Optional)
            // navigate("/success"); 
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if money was deducted.",
              variant: "destructive"
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#E11D48",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error("Payment Error:", error);
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 pt-16 sm:pt-20 md:pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-foreground mb-2 sm:mb-4">
              <span className="text-glow-red text-primary">Checkout</span>
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20 lg:mb-24">
            {/* Order Summary */}
            <Card className="bg-card border-border animate-fade-in">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-foreground text-center md:text-left">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    Your cart is empty.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {cartItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm sm:text-base text-muted-foreground border-b border-border/50 pb-2">
                        <div className="flex-1">
                          <span className="block font-medium text-foreground">{item.name}</span>
                          <span className="text-xs text-muted-foreground/80">{item.size}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-foreground">₹{item.price}</span>
                          <button
                            onClick={() => handleRemoveItem(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between text-sm sm:text-base text-muted-foreground pt-2">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-lg sm:text-xl font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card className="bg-card border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg sm:text-xl text-foreground text-center md:text-left">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm sm:text-base text-foreground">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="bg-input border-border text-foreground text-sm sm:text-base"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base text-foreground">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className="bg-input border-border text-foreground text-sm sm:text-base"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base text-foreground">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+91 98765 43210"
                    className="bg-input border-border text-foreground text-sm sm:text-base"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base text-foreground">Shipping Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Street, City"
                    className="bg-input border-border text-foreground text-sm sm:text-base"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <Button
                  onClick={handlePayment}
                  disabled={cartItems.length === 0}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-lg py-4 sm:py-6 animate-glow-pulse disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pay with Razorpay
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
