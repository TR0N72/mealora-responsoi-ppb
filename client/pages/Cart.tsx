import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import PaymentModal from "@/components/PaymentModal";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const formatPrice = (price: number) => {
    return `Rp ${(price / 1000).toLocaleString('id-ID')}K`;
  };

  const handleCheckout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast({
        title: "Please login",
        description: "You need to be logged in to checkout.",
        variant: "destructive",
      });
      return;
    }

    setPaymentModalOpen(true);
  };

  const processPayment = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    try {
      const deliveryStart = new Date();
      deliveryStart.setHours(deliveryStart.getHours() + 25); // 25 hours from now
      const deliveryEnd = new Date(deliveryStart);
      deliveryEnd.setHours(deliveryEnd.getHours() + 1);

      const response = await fetch('/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: items
            .filter(item => item.id)
            .map(item => ({
              menu_id: item.id,
              quantity: item.quantity,
              // price is calculated on server
            })),
          delivery_window_start: deliveryStart.toISOString(),
          delivery_window_end: deliveryEnd.toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      clearCart();
      toast({
        title: "Order placed!",
        description: "Your order has been successfully placed.",
      });
    } catch (error) {
      toast({
        title: "Checkout failed",
        description: "There was an error processing your order.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setPaymentModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-12 md:py-16 px-4">
        <div className="max-w-[1273px] mx-auto">
          <h1 className="font-modak text-[40px] md:text-[64px] leading-tight text-black mb-8 md:mb-12 text-center">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-arial-rounded text-xl text-gray-500 mb-8">
                Your cart is empty.
              </p>
              <Link to="/menu">
                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-arial-rounded">
                  Browse Menu
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              <div className="lg:col-span-2 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex flex-col md:flex-row items-center gap-6 p-6 border border-black rounded-[25px] bg-white"
                  >
                    <div className="w-32 h-32 flex-shrink-0 bg-[#F2F2F2] rounded-2xl p-2 flex items-center justify-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 text-center md:text-left w-full">
                      <h3 className="font-modak text-2xl text-black mb-2">{item.name}</h3>
                      <p className="font-arial-rounded text-xl text-[#FF7A00] mb-4">{item.price}</p>

                      <div className="flex items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center border border-black rounded-full px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.name, item.quantity - 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-arial-rounded text-lg w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.name, item.quantity + 1)}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="border border-black rounded-[25px] p-6 sticky top-24">
                  <h2 className="font-modak text-2xl text-black mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between font-arial-rounded text-lg">
                      <span>Total Items</span>
                      <span>{totalItems}</span>
                    </div>
                    <div className="flex justify-between font-arial-rounded text-xl font-bold border-t border-black/10 pt-4">
                      <span>Total Price</span>
                      <span className="text-[#FF7A00]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg font-arial-rounded"
                  >
                    {loading ? "Processing..." : "Checkout"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <PaymentModal
        open={paymentModalOpen}
        onOpenChange={setPaymentModalOpen}
        totalPrice={totalPrice}
        onConfirm={processPayment}
        loading={loading}
      />
    </div>
  );
}
