"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { useCart } from "@/lib/store";

const categoryColors = {
  drinks: "bg-dragonfly-green/10 text-dragonfly-green",
  foods: "bg-dragonfly-gold/15 text-dragonfly-brown",
  desserts: "bg-dragonfly-brown/10 text-dragonfly-brown",
};

const categoryLabels = {
  drinks: "نوشیدنی",
  foods: "غذا",
  desserts: "دسر",
};

const categoryIcons = {
  drinks: "☕",
  foods: "🍽️",
  desserts: "🍰",
};

export default function MenuItemCard({ item, index = 0 }) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [modalImgError, setModalImgError] = useState(false);
  const { addItem } = useCart();

  const hasImage = item.image && item.image.trim() && !imgError;

  const handleAdd = () => {
    addItem(item, quantity);
    setJustAdded(true);
    setTimeout(() => {
      setJustAdded(false);
      setShowModal(false);
      setQuantity(1);
      setModalImgError(false);
    }, 600);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      >
        <Card
          hover={item.available}
          onClick={item.available ? () => setShowModal(true) : undefined}
          className={`overflow-hidden ${!item.available ? "opacity-60" : ""}`}
        >
          {/* Image */}
          <div className="relative h-44 bg-gradient-to-bl from-dragonfly-taupe/40 to-dragonfly-cream flex items-center justify-center overflow-hidden">
            {hasImage ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-5xl">
                {categoryIcons[item.category] || "🍽️"}
              </span>
            )}
            {!item.available && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <Badge color="gray">ناموجود</Badge>
              </div>
            )}
            {item.featured && (
              <div className="absolute top-3 left-3">
                <Badge color="gold">★ ویژه</Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-dragonfly-text text-[15px] leading-tight">
                {item.name}
              </h3>
              <span className="text-dragonfly-gold font-bold text-sm whitespace-nowrap">
                {item.price.toLocaleString("fa-IR")} ت
              </span>
            </div>
            <p className="text-dragonfly-muted text-xs leading-relaxed line-clamp-2 mb-3">
              {item.description}
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  categoryColors[item.category] || categoryColors.drinks
                }`}
              >
                {categoryLabels[item.category] || item.category}
              </span>
              {item.available && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                  className="p-2 rounded-full bg-dragonfly-brown text-white hover:bg-dragonfly-brown-light transition-colors"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setQuantity(1);
          setModalImgError(false);
        }}
        title={item.name}
      >
        <div className="p-6">
          {/* Large image */}
          <div className="w-full h-48 bg-gradient-to-bl from-dragonfly-taupe/30 to-dragonfly-cream rounded-xl flex items-center justify-center mb-5 overflow-hidden">
            {hasImage && !modalImgError ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
                onError={() => setModalImgError(true)}
              />
            ) : (
              <span className="text-7xl">
                {categoryIcons[item.category] || "🍽️"}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  categoryColors[item.category] || categoryColors.drinks
                }`}
              >
                {categoryLabels[item.category] || item.category}
              </span>
              {item.featured && <Badge color="gold">★ ویژه</Badge>}
            </div>
            <p className="text-dragonfly-muted text-sm leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Price */}
          <div className="text-2xl font-bold text-dragonfly-gold mb-5">
            {item.price.toLocaleString("fa-IR")} تومان
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full border-2 border-dragonfly-brown text-dragonfly-brown flex items-center justify-center hover:bg-dragonfly-brown hover:text-white transition-colors"
            >
              <Minus size={18} />
            </button>
            <span className="text-2xl font-bold text-dragonfly-text w-8 text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full border-2 border-dragonfly-brown text-dragonfly-brown flex items-center justify-center hover:bg-dragonfly-brown hover:text-white transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to cart button */}
          {justAdded ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full py-3 text-center bg-dragonfly-green text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              ✓ به سفارش اضافه شد!
            </motion.div>
          ) : (
            <Button
              onClick={handleAdd}
              variant="primary"
              size="lg"
              className="w-full"
            >
              <ShoppingCart size={18} />
              افزودن به سفارش — {(item.price * quantity).toLocaleString("fa-IR")} ت
            </Button>
          )}
        </div>
      </Modal>
    </>
  );
}
