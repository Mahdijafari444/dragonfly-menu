"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  DollarSign,
  Coffee,
  Clock,
  X,
} from "lucide-react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { useNotifications } from "@/lib/notifications";

const statusLabels = {
  pending: "در انتظار",
  preparing: "آماده‌سازی",
  ready: "آماده",
  completed: "تحویل شده",
};

const statusColors = {
  pending: "amber",
  preparing: "blue",
  ready: "green",
  completed: "gray",
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const { lastOrderId, clearNewOrderCount } = useNotifications();
  const [showToast, setShowToast] = useState(false);
  const [toastOrder, setToastOrder] = useState(null);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then(setOrders)
      .catch(console.error);
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastOrderId && orders.length > 0) {
      const order = orders.find((o) => o.id === lastOrderId);
      if (order) {
        setToastOrder(order);
        setShowToast(true);
        clearNewOrderCount();
        const timer = setTimeout(() => setShowToast(false), 6000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastOrderId, orders, clearNewOrderCount]);

  const today = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  );
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const totalItemsSold = todayOrders.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  const stats = [
    {
      label: "سفارشات امروز",
      value: todayOrders.length.toLocaleString("fa-IR"),
      icon: ShoppingBag,
      color: "bg-dragonfly-green",
    },
    {
      label: "درآمد امروز",
      value: `${todayRevenue.toLocaleString("fa-IR")} ت`,
      icon: DollarSign,
      color: "bg-dragonfly-gold",
    },
    {
      label: "اقلام فروخته شده",
      value: totalItemsSold.toLocaleString("fa-IR"),
      icon: Coffee,
      color: "bg-dragonfly-brown",
    },
    {
      label: "در انتظار",
      value: pendingOrders.length.toLocaleString("fa-IR"),
      icon: Clock,
      color: pendingOrders.length > 0 ? "bg-amber-500" : "bg-dragonfly-muted",
      pulse: pendingOrders.length > 0,
    },
  ];

  return (
    <div>
      {/* New Order Toast */}
      <AnimatePresence>
        {showToast && toastOrder && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 bg-dragonfly-green text-white rounded-2xl flex items-center gap-4 shadow-lg shadow-dragonfly-green/20"
          >
            <span className="text-3xl">🔔</span>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                سفارش جدید از {toastOrder.customerName || "مهمان"}
                {toastOrder.tableNumber && ` — ${toastOrder.tableNumber}`}
              </p>
              <p className="text-white/80 text-xs">
                {toastOrder.items.length} آیتم —{" "}
                {toastOrder.total.toLocaleString("fa-IR")} ت
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors"
            >
              مشاهده
            </Link>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-dragonfly-text mb-1">
          داشبورد
        </h1>
        <p className="text-dragonfly-muted text-sm">
          خوش آمدید! وضعیت امروز اینجا نمایش داده می‌شود.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl p-5 card-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center text-white`}
                >
                  <Icon size={18} />
                </div>
                {stat.pulse && (
                  <span className="w-2.5 h-2.5 bg-amber-500 rounded-full status-pulse" />
                )}
              </div>
              <p className="text-dragonfly-muted text-xs mb-1">{stat.label}</p>
              <p className="text-dragonfly-text text-2xl font-bold">
                {stat.value}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-dragonfly-text">آخرین سفارشات</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-dragonfly-brown hover:underline"
          >
            مشاهده همه ←
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl block mb-3">📋</span>
            <p className="text-dragonfly-muted text-sm">هنوز سفارشی ثبت نشده</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-dragonfly-cream/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-dragonfly-cream rounded-lg flex items-center justify-center text-sm font-medium text-dragonfly-brown">
                    #{order.id.slice(-4)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dragonfly-text">
                      {order.customerName || "مهمان"}
                      {order.tableNumber && (
                        <span className="text-dragonfly-muted font-normal">
                          {" "}
                          — {order.tableNumber}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-dragonfly-muted">
                      {order.items.length} آیتم —{" "}
                      {new Date(order.createdAt).toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge color={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                  <span className="text-sm font-semibold text-dragonfly-gold">
                    {order.total.toLocaleString("fa-IR")} ت
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
