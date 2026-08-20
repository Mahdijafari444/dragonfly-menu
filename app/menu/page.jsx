"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CategoryTabs from "@/components/CategoryTabs";
import MenuItemCard from "@/components/MenuItemCard";
import { useCart } from "@/lib/store";

export default function MenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const { totalItems, totalPrice } = useCart();

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.filter((item) => item.available));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredItems = useMemo(() => {
    let result = items;
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, activeCategory, search]);

  return (
    <div className="min-h-screen bg-dragonfly-cream">
      <Navbar />

      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-dragonfly-text mb-2">
            منوی ما
          </h1>
          <p className="text-dragonfly-muted">
            با عشق و دقت برای شما آماده شده
          </p>
        </motion.div>
      </div>

      {/* Search & Tabs */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative w-full sm:w-80">
            <Search
              size={18}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-dragonfly-muted"
            />
            <input
              type="text"
              placeholder="جستجو در منو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 bg-white rounded-xl border border-dragonfly-taupe/50 text-sm text-dragonfly-text placeholder:text-dragonfly-muted/60 focus:outline-none focus:border-dragonfly-brown focus:ring-2 focus:ring-dragonfly-brown/10 transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="w-full sm:w-auto">
            <CategoryTabs
              active={activeCategory}
              onChange={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl h-72 animate-pulse"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-dragonfly-text font-semibold mb-2">
              آیتمی یافت نشد
            </h3>
            <p className="text-dragonfly-muted text-sm">
              دسته‌بندی یا عبارت دیگری را امتحان کنید
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredItems.map((item, index) => (
                <MenuItemCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Floating Cart Button */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 left-6 z-30"
          >
            <Link
              href="/order"
              className="flex items-center gap-3 px-6 py-4 bg-dragonfly-brown text-white rounded-2xl shadow-lg hover:bg-dragonfly-brown-light transition-colors"
            >
              <div className="relative">
                <ShoppingCart size={22} />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-dragonfly-green text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">
                  {totalItems} آیتم
                </p>
                <p className="text-xs text-white/80">
                  {totalPrice.toLocaleString("fa-IR")} ت
                </p>
              </div>
              <span className="mr-2">←</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
