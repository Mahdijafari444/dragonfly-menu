"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";

const defaultItem = {
  name: "",
  description: "",
  price: "",
  category: "drinks",
  image: "",
  available: true,
  featured: false,
};

const categoryLabels = {
  drinks: "نوشیدنی",
  foods: "غذا",
  desserts: "دسر",
};

const categoryColors = {
  drinks: "light-green",
  foods: "gold",
  desserts: "brown",
};

const categoryIcons = {
  drinks: "☕",
  foods: "🍽️",
  desserts: "🍰",
};

export default function AdminMenuPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(defaultItem);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchItems = () => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openAdd = () => {
    setEditingItem(null);
    setForm(defaultItem);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      image: item.image || "",
      available: item.available,
      featured: item.featured,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const body = {
        ...form,
        price: parseFloat(form.price),
      };

      if (editingItem) {
        await fetch(`/api/menu/${editingItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        await fetch("/api/menu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }
      fetchItems();
      setShowModal(false);
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("آیا از حذف این آیتم مطمئن هستید؟")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/menu/${id}`, { method: "DELETE" });
      fetchItems();
    } catch (error) {
      console.error("Failed to delete:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleAvailability = async (item) => {
    try {
      await fetch(`/api/menu/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: !item.available }),
      });
      fetchItems();
    } catch (error) {
      console.error("Failed to toggle:", error);
    }
  };

  const grouped = {
    drinks: items.filter((i) => i.category === "drinks"),
    foods: items.filter((i) => i.category === "foods"),
    desserts: items.filter((i) => i.category === "desserts"),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dragonfly-text mb-1">
            مدیریت منو
          </h1>
          <p className="text-dragonfly-muted text-sm">
            اضافه، ویرایش یا حذف آیتم‌های منو
          </p>
        </div>
        <Button onClick={openAdd} variant="primary" size="md">
          <Plus size={16} />
          افزودن آیتم
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-20 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-dragonfly-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                {categoryLabels[category]} ({categoryItems.length})
              </h2>

              {categoryItems.length === 0 ? (
                <p className="text-dragonfly-muted text-sm py-4">
                  هنوز آیتمی در این دسته‌بندی وجود ندارد
                </p>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {categoryItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className={`bg-white rounded-xl p-4 flex items-center gap-4 card-shadow ${
                          !item.available ? "opacity-50" : ""
                        }`}
                      >
                        {/* Image preview */}
                        <div className="w-12 h-12 rounded-lg bg-dragonfly-cream flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image && item.image.trim() ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <span
                            className={`text-xl ${item.image ? "hidden" : "flex"}`}
                          >
                            {categoryIcons[item.category] || "🍽️"}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-medium text-dragonfly-text text-sm truncate">
                              {item.name}
                            </h3>
                            {item.featured && (
                              <Badge color="gold">ویژه</Badge>
                            )}
                          </div>
                          <p className="text-xs text-dragonfly-muted truncate">
                            {item.description || "بدون توضیح"}
                          </p>
                        </div>

                        <span className="text-dragonfly-gold font-bold text-sm whitespace-nowrap">
                          {item.price.toLocaleString("fa-IR")} ت
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleAvailability(item)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.available
                                ? "text-dragonfly-green hover:bg-dragonfly-green/10"
                                : "text-dragonfly-muted hover:bg-gray-100"
                            }`}
                            title={
                              item.available ? "ناموجود کردن" : "موجود کردن"
                            }
                          >
                            {item.available ? (
                              <Eye size={16} />
                            ) : (
                              <EyeOff size={16} />
                            )}
                          </button>
                          <button
                            onClick={() => openEdit(item)}
                            className="p-2 rounded-lg text-dragonfly-muted hover:text-dragonfly-brown hover:bg-dragonfly-brown/10 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 rounded-lg text-dragonfly-muted hover:text-dragonfly-red hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingItem ? "ویرایش آیتم" : "افزودن آیتم جدید"}
      >
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-dragonfly-muted mb-1.5">
              نام *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثلاً کاپوچینو"
              className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-dragonfly-muted mb-1.5">
              توضیحات
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="توضیح کوتاه..."
              rows={2}
              className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30 resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-medium text-dragonfly-muted mb-1.5">
              <ImageIcon size={12} className="inline ml-1" />
              لینک تصویر (اختیاری)
            </label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30"
              dir="ltr"
            />
            <p className="text-dragonfly-muted text-[10px] mt-1">
              لینک مستقیم تصویر را اینجا وارد کنید (مثلاً از Google Drive یا هاست دیگر)
            </p>
            {/* Image preview */}
            {form.image && form.image.trim() && (
              <div className="mt-2 w-full h-32 bg-dragonfly-cream rounded-xl overflow-hidden flex items-center justify-center">
                <img
                  src={form.image}
                  alt="پیش‌نمایش"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "";
                    e.target.className = "hidden";
                  }}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-dragonfly-muted mb-1.5">
                قیمت (تومان) *
              </label>
              <input
                type="number"
                step="1000"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0"
                className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-dragonfly-muted mb-1.5">
                دسته‌بندی
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full px-4 py-2.5 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 border border-transparent focus:border-dragonfly-brown/30"
              >
                <option value="drinks">☕ نوشیدنی</option>
                <option value="foods">🍽️ غذا</option>
                <option value="desserts">🍰 دسر</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) =>
                  setForm({ ...form, available: e.target.checked })
                }
                className="w-4 h-4 accent-dragonfly-green rounded"
              />
              <span className="text-sm text-dragonfly-text">موجود</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm({ ...form, featured: e.target.checked })
                }
                className="w-4 h-4 accent-dragonfly-gold rounded"
              />
              <span className="text-sm text-dragonfly-text">ویژه</span>
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => setShowModal(false)}
              variant="ghost"
              className="flex-1"
            >
              انصراف
            </Button>
            <Button
              onClick={handleSave}
              disabled={!form.name || !form.price || saving}
              variant="primary"
              className="flex-1"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : editingItem ? (
                "ذخیره تغییرات"
              ) : (
                "افزودن"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
