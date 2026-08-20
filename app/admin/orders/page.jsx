"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, RefreshCw, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { useNotifications } from "@/lib/notifications";

const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "amber",
    next: "preparing",
    nextLabel: "شروع آماده‌سازی",
  },
  preparing: {
    label: "آماده‌سازی",
    color: "blue",
    next: "ready",
    nextLabel: "آماده تحویل",
  },
  ready: {
    label: "آماده",
    color: "green",
    next: "completed",
    nextLabel: "تحویل شد",
  },
  completed: {
    label: "تحویل شده",
    color: "gray",
    next: null,
    nextLabel: "",
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const { lastOrderId, clearNewOrderCount } = useNotifications();
  const [showToast, setShowToast] = useState(false);
  const [toastOrder, setToastOrder] = useState(null);

  const fetchOrders = () => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastOrderId && orders.length > 0) {
      const order = orders.find((o) => o.id === lastOrderId);
      if (order) {
        setToastOrder(order);
        setShowToast(true);
        clearNewOrderCount();
        const timer = setTimeout(() => setShowToast(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastOrderId, orders, clearNewOrderCount]);

  const updateStatus = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchOrders();
    } catch (error) {
      console.error("Failed to update order:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const activeOrders = orders.filter((o) => o.status !== "completed");
  const completedOrders = orders.filter((o) => o.status === "completed");

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
            <button
              onClick={() => setShowToast(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dragonfly-text mb-1">
            سفارشات
          </h1>
          <p className="text-dragonfly-muted text-sm">
            مدیریت سفارشات به صورت آنلاین
          </p>
        </div>
        <Button onClick={fetchOrders} variant="ghost" size="sm">
          <RefreshCw size={16} />
          بروزرسانی
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl block mb-4">📋</span>
          <h3 className="text-dragonfly-text font-semibold mb-2">
            هنوز سفارشی ثبت نشده
          </h3>
          <p className="text-dragonfly-muted text-sm">
            سفارشات مشتریان اینجا نمایش داده می‌شوند
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Orders */}
          {activeOrders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-dragonfly-muted uppercase tracking-wider mb-4">
                سفارشات فعال ({activeOrders.length.toLocaleString("fa-IR")})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {activeOrders.map((order) => {
                    const cfg = statusConfig[order.status];
                    return (
                      <motion.div
                        key={order.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl p-5 card-shadow border-r-4 border-dragonfly-green"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-dragonfly-muted">
                              #{order.id.slice(-6)}
                            </span>
                            <Badge color={cfg.color} pulse>
                              {cfg.label}
                            </Badge>
                          </div>
                          <span className="text-dragonfly-gold font-bold text-sm">
                            {order.total.toLocaleString("fa-IR")} ت
                          </span>
                        </div>

                        {order.customerName &&
                          order.customerName !== "مهمان" && (
                            <p className="text-sm text-dragonfly-text mb-1">
                              {order.customerName}
                              {order.tableNumber && (
                                <span className="text-dragonfly-muted">
                                  {" "}
                                  — {order.tableNumber}
                                </span>
                              )}
                            </p>
                          )}

                        <div className="space-y-1 mb-4">
                          {order.items.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="text-dragonfly-text">
                                {item.quantity}× {item.name}
                              </span>
                              <span className="text-dragonfly-muted">
                                {(item.price * item.quantity).toLocaleString("fa-IR")} ت
                              </span>
                            </div>
                          ))}
                        </div>

                        <p className="text-[10px] text-dragonfly-muted mb-3">
                          {new Date(order.createdAt).toLocaleTimeString("fa-IR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>

                        {cfg.next && (
                          <button
                            onClick={() => updateStatus(order.id, cfg.next)}
                            disabled={updatingId === order.id}
                            className="w-full flex items-center justify-center gap-2 py-2.5 bg-dragonfly-green text-white rounded-xl text-sm font-medium hover:bg-dragonfly-green-light transition-colors disabled:opacity-50"
                          >
                            {updatingId === order.id ? (
                              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <>
                                {cfg.nextLabel}
                                <ChevronLeft size={16} />
                              </>
                            )}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* Completed Orders */}
          {completedOrders.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-dragonfly-muted uppercase tracking-wider mb-4">
                تحویل شده ({completedOrders.length.toLocaleString("fa-IR")})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {completedOrders.slice(0, 6).map((order) => (
                  <div
                    key={order.id}
                    className="bg-white/60 rounded-2xl p-4 opacity-70"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-dragonfly-muted">
                        #{order.id.slice(-6)}
                      </span>
                      <Badge color="gray">تمام</Badge>
                    </div>
                    <p className="text-xs text-dragonfly-muted">
                      {order.customerName || "مهمان"} —{" "}
                      {order.total.toLocaleString("fa-IR")} ت
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
