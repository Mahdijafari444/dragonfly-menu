import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, "..", "data");

// In-memory fallback for Vercel/serverless environments (read-only filesystem)
let inMemoryMenu = null;
let inMemoryOrders = null;

// Default menu data (used when JSON file isn't writable)
const defaultMenu = [
  { id: "1", name: "اسپرسو", description: "یک شات اسپرسوی غلیظ و خوش‌طعم از ترکیب خانگی ما", price: 80000, category: "drinks", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "2", name: "کاپوچینو", description: "شیر بخار داده شده نرم با کف غلیظ روی اسپرسو", price: 120000, category: "drinks", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "3", name: "لاته کاراملی", description: "لاته خامه‌ای با کارامل خانگی و وانیل", price: 130000, category: "drinks", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "4", name: "لاته چای سبز", description: "چای سبز ماچای درجه یک با شیر جو دوسر", price: 140000, category: "drinks", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "5", name: "آمریکانو سرد", description: "دو شات اسپرسو روی یخ با آب فیلتر شده سرد", price: 100000, category: "drinks", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "6", name: "اسپشیال دراگونفلای", description: "نوشیدنی امضاشده ما — اسپرسو، شیر نارگیل، وانیل و کمی دارچین", price: 150000, category: "drinks", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "7", name: "آب پرتقال تازه", description: "آب پرتقال تازه فشرده شده بدون افزودنی", price: 110000, category: "drinks", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "8", name: "آووکادو توست", description: "نان ساورداو با آووکادو له شده، گوجه گیلاسی و میکروگرین", price: 210000, category: "foods", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "9", name: "پانینی گریل شده", description: "بوقلمون، بری، سس زرشک و راکولا روی نان چیاباتا", price: 225000, category: "foods", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "10", name: "سالاد سزار", description: "کاهو رومانو، پارمسان، کروتن و سس سزار خانگی", price: 200000, category: "foods", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "11", name: "بوریتو صبحانه", description: "تخم‌مرغ نیمرو، لوبیا سیاه، پنیر، سالسا ورده در نان تورتیلا", price: 235000, category: "foods", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "12", name: "رپ مرغ", description: "مرغ گریل شده، حمص، فلفل کبابی و سبزیجات تازه", price: 250000, category: "foods", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "13", name: "مافین بلوبری", description: "مافین تازه پخته شده با بلوبری ارگانیک", price: 90000, category: "desserts", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "14", name: "براونی شکلاتی", description: "براونی غنی و شکلاتی با شکلات تلخ بلژیکی", price: 115000, category: "desserts", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "15", name: "تیرامیسو", description: "دسر ایتالیایی کلاسیک با کرم ماسکارپونه و بیسکویت خیس شده در اسپرسو", price: 150000, category: "desserts", image: "", available: true, featured: true, createdAt: "2025-01-01T00:00:00.000Z" },
  { id: "16", name: "کرواسان", description: "کرواسان فرانسوی کره‌ای و خوش‌طعم، عالی با قهوه", price: 75000, category: "desserts", image: "", available: true, featured: false, createdAt: "2025-01-01T00:00:00.000Z" },
];

let fileDbAvailable = true;
let menuDb;
let ordersDb;

function tryInitFileDb() {
  try {
    const adapter = new FileSync(path.join(dataDir, "menu.json"));
    menuDb = low(adapter);
    menuDb.defaults({ items: defaultMenu }).write();

    const ordersAdapter = new FileSync(path.join(dataDir, "orders.json"));
    ordersDb = low(ordersAdapter);
    ordersDb.defaults({ orders: [] }).write();
  } catch (e) {
    // Vercel / serverless — filesystem is read-only
    fileDbAvailable = false;
    inMemoryMenu = [...defaultMenu];
    inMemoryOrders = [];
  }
}

tryInitFileDb();

// ===== MENU =====

export function getMenuItems() {
  if (!fileDbAvailable) return inMemoryMenu;
  return menuDb.get("items").value();
}

export function addMenuItem(item) {
  const newItem = {
    id: Date.now().toString(),
    name: item.name,
    description: item.description || "",
    price: Number(item.price),
    category: item.category || "drinks",
    image: item.image || "",
    available: item.available !== false,
    featured: item.featured || false,
    createdAt: new Date().toISOString(),
  };

  if (!fileDbAvailable) {
    inMemoryMenu.push(newItem);
    return newItem;
  }

  menuDb.get("items").push(newItem).write();
  return newItem;
}

export function updateMenuItem(id, updates) {
  if (!fileDbAvailable) {
    const idx = inMemoryMenu.findIndex((i) => i.id === id);
    if (idx === -1) return null;
    inMemoryMenu[idx] = { ...inMemoryMenu[idx], ...updates };
    return inMemoryMenu[idx];
  }

  const item = menuDb.get("items").find({ id }).value();
  if (!item) return null;
  const updated = { ...item, ...updates };
  menuDb.get("items").find({ id }).assign(updated).write();
  return updated;
}

export function deleteMenuItem(id) {
  if (!fileDbAvailable) {
    const idx = inMemoryMenu.findIndex((i) => i.id === id);
    if (idx === -1) return false;
    inMemoryMenu.splice(idx, 1);
    return true;
  }

  const found = menuDb.get("items").find({ id }).value();
  if (!found) return false;
  menuDb.get("items").remove({ id }).write();
  return true;
}

// ===== ORDERS =====

export function getOrders() {
  if (!fileDbAvailable) return inMemoryOrders;
  return ordersDb.get("orders").value();
}

export function getOrder(id) {
  if (!fileDbAvailable) return inMemoryOrders.find((o) => o.id === id) || null;
  return ordersDb.get("orders").find({ id }).value() || null;
}

export function addOrder(orderData) {
  const newOrder = {
    id: Date.now().toString(),
    items: orderData.items || [],
    total: Number(orderData.total) || 0,
    customerName: orderData.customerName || "مهمان",
    tableNumber: orderData.tableNumber || null,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!fileDbAvailable) {
    inMemoryOrders.unshift(newOrder);
    return newOrder;
  }

  ordersDb.get("orders").unshift(newOrder).write();
  return newOrder;
}

export function updateOrderStatus(id, status) {
  if (!fileDbAvailable) {
    const order = inMemoryOrders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  const order = ordersDb.get("orders").find({ id }).value();
  if (!order) return null;
  ordersDb.get("orders").find({ id }).assign({
    status,
    updatedAt: new Date().toISOString(),
  }).write();
  return ordersDb.get("orders").find({ id }).value();
}
