"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CartItem from "@/components/CartItem";
import Button from "@/components/ui/Button";
import { useCart } from "@/lib/store";

export default function OrderPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [table, setTable] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total: totalPrice,
          customerName: name || "مهمان",
          tableNumber: table || null,
        }),
      });

      if (res.ok) {
        const order = await res.json();
        clearCart();
        router.push(`/order/confirmation/${order.id}`);
      }
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dragonfly-cream">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-dragonfly-muted hover:text-dragonfly-brown transition-colors mb-6 text-sm"
        >
          بازگشت به منو
          <ArrowRight size={16} />
        </Link>

        <h1 className="text-3xl font-bold text-dragonfly-text mb-8">
          سفارش شما
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <span className="text-6xl block mb-4">🛒</span>
            <h3 className="text-dragonfly-text font-semibold mb-2">
              سبد شما خالی است
            </h3>
            <p className="text-dragonfly-muted text-sm mb-6">
              از منوی ما آیتم‌های خوشمزه‌ای اضافه کنید
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-dragonfly-brown text-white rounded-xl font-medium text-sm hover:bg-dragonfly-brown-light transition-colors"
            >
              مشاهده منو
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Cart items */}
            <div className="space-y-3 mb-6">
              <AnimatePresence>
                {items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* Customer info */}
            <div className="bg-white rounded-2xl p-5 mb-6 space-y-4">
              <h3 className="font-semibold text-dragonfly-text text-sm">
                اطلاعات شما
              </h3>
              <div>
                <label className="block text-xs text-dragonfly-muted mb-1.5">
                  نام (اختیاری)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام شما"
                  className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/60 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs text-dragonfly-muted mb-1.5">
                  شماره میز (اختیاری)
                </label>
                <input
                  type="text"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  placeholder="مثلاً میز ۳"
                  className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/60 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30 transition-all"
                />
              </div>
            </div>

            {/* Total & Place Order */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-dragonfly-muted text-sm">
                  جمع ({items.reduce((s, i) => s + i.quantity, 0)} آیتم)
                </span>
                <span className="text-dragonfly-text font-semibold">
                  {totalPrice.toLocaleString("fa-IR")} ت
                </span>
              </div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                <span className="text-dragonfly-text font-semibold">
                  مبلغ قابل پرداخت
                </span>
                <span className="text-dragonfly-gold text-xl font-bold">
                  {totalPrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <Button
                onClick={handlePlaceOrder}
                disabled={submitting || items.length === 0}
                variant="secondary"
                size="lg"
                className="w-full"
              >
                {submitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    در حال ثبت سفارش...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    ثبت سفارش
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
