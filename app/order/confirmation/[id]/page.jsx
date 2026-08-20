"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Badge from "@/components/ui/Badge";

const statusConfig = {
  pending: {
    label: "سفارش ثبت شد",
    description: "سفارش شما دریافت شد! به زودی آماده‌سازی را شروع می‌کنیم.",
    color: "amber",
    icon: "📝",
  },
  preparing: {
    label: "در حال آماده‌سازی",
    description: "سفارش شما با دقت آماده می‌شود!",
    color: "blue",
    icon: "👨‍🍳",
  },
  ready: {
    label: "آماده تحویل",
    description: "سفارش شما آماده است! لطفاً تحویل بگیرید.",
    color: "green",
    icon: "✨",
  },
  completed: {
    label: "تحویل شد",
    description: "سفارش شما تحویل داده شد. نوش جان!",
    color: "gray",
    icon: "🎉",
  },
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = () => {
      fetch(`/api/orders/${params.id}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    };

    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [params.id]);

  const status = order
    ? statusConfig[order.status] || statusConfig.pending
    : statusConfig.pending;

  if (loading) {
    return (
      <div className="min-h-screen bg-dragonfly-cream">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-dragonfly-taupe border-t-dragonfly-brown rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-dragonfly-cream">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <span className="text-5xl block mb-4">❓</span>
          <h2 className="text-xl font-semibold text-dragonfly-text mb-2">
            سفارش یافت نشد
          </h2>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-dragonfly-brown text-white rounded-xl text-sm font-medium"
          >
            بازگشت به منو
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dragonfly-cream">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-8">
        {/* Success animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.1,
          }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-dragonfly-green/10 rounded-full flex items-center justify-center mb-4">
            <span className="text-5xl">{status.icon}</span>
          </div>
          <h1 className="text-2xl font-bold text-dragonfly-text mb-2">
            {status.label}
          </h1>
          <p className="text-dragonfly-muted text-sm">{status.description}</p>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-dragonfly-text text-sm">
              سفارش #{order.id.slice(-6)}
            </h3>
            <Badge color={status.color} pulse={order.status !== "completed"}>
              {status.label}
            </Badge>
          </div>

          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-dragonfly-text">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-dragonfly-muted">
                  {(item.price * item.quantity).toLocaleString("fa-IR")} ت
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="font-semibold text-dragonfly-text">جمع کل</span>
            <span className="font-bold text-dragonfly-gold text-lg">
              {order.total.toLocaleString("fa-IR")} تومان
            </span>
          </div>

          {order.customerName && order.customerName !== "مهمان" && (
            <div className="mt-3 pt-3 border-t border-gray-100 text-sm text-dragonfly-muted">
              {order.customerName}
              {order.tableNumber && ` — ${order.tableNumber}`}
            </div>
          )}
        </motion.div>

        {/* Status progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-5 mb-8"
        >
          <h3 className="font-semibold text-dragonfly-text text-sm mb-4">
            وضعیت سفارش
          </h3>
          <div className="space-y-3">
            {Object.entries(statusConfig).map(([key, cfg]) => {
              const statusOrder = [
                "pending",
                "preparing",
                "ready",
                "completed",
              ];
              const currentIndex = statusOrder.indexOf(order.status);
              const isActive = statusOrder.indexOf(key) <= currentIndex;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full flex-shrink-0 ${
                      isActive
                        ? key === "completed"
                          ? "bg-dragonfly-muted"
                          : "bg-dragonfly-green"
                        : "bg-gray-200"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      isActive
                        ? "text-dragonfly-text font-medium"
                        : "text-dragonfly-muted"
                    }`}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Back to menu */}
        <div className="text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-dragonfly-brown text-white rounded-xl text-sm font-medium hover:bg-dragonfly-brown-light transition-colors"
          >
            بازگشت به منو
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
