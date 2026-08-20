import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/store";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Dragonfly — کافه دراگونفلای",
  description:
    "منوی کافه دراگونفلای — نوشیدنی‌های دست‌ساز و غذاهای خوشمزه در فضایی صمیمی.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
