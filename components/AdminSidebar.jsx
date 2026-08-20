"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Coffee,
  LogOut,
  Bell,
  BellOff,
} from "lucide-react";
import { useNotifications } from "@/lib/notifications";

const navItems = [
  {
    href: "/admin",
    label: "داشبورد",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/admin/orders",
    label: "سفارش‌ها",
    icon: ShoppingBag,
    exact: false,
    badgeKey: "orders",
  },
  {
    href: "/admin/menu",
    label: "منو",
    icon: Coffee,
    exact: false,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { muted, toggleMute, newOrderCount } = useNotifications();

  const isActive = (href, exact) => {
    return exact ? pathname === href : pathname.startsWith(href);
  };

  return (
    <aside className="w-64 bg-dragonfly-dark min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dragonfly-green flex items-center justify-center text-white font-bold text-lg">
            🪰
          </div>
          <div>
            <h1 className="text-white font-semibold text-sm">
              دراگونفلای
            </h1>
            <p className="text-dragonfly-muted text-xs">پنل مدیریت</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-4 py-3 rounded-xl
                text-sm font-medium transition-colors duration-200
                ${
                  active
                    ? "text-white"
                    : "text-dragonfly-muted hover:text-white hover:bg-white/5"
                }
              `}
            >
              {active && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute inset-0 bg-dragonfly-green rounded-xl"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <Icon size={18} className="relative z-10" />
              <span className="relative z-10">{item.label}</span>

              {item.badgeKey === "orders" && newOrderCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="relative z-10 ml-auto w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                >
                  {newOrderCount > 9 ? "۹+" : newOrderCount}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom controls */}
      <div className="p-4 border-t border-white/10 space-y-1">
        {/* Sound toggle */}
        <button
          onClick={toggleMute}
          className={`
            w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-sm font-medium transition-colors duration-200
            ${
              muted
                ? "text-dragonfly-muted hover:text-white hover:bg-white/5"
                : "text-dragonfly-green hover:bg-dragonfly-green/10"
            }
          `}
        >
          {muted ? <BellOff size={18} /> : <Bell size={18} />}
          <span>{muted ? "صدا خاموش" : "صدا روشن"}</span>
          {!muted && (
            <span className="mr-auto w-2 h-2 bg-dragonfly-green rounded-full status-pulse" />
          )}
        </button>

        <Link
          href="/menu"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dragonfly-muted hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut size={18} />
          <span>مشاهده منو</span>
        </Link>
      </div>
    </aside>
  );
}
