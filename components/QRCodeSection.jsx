"use client";

import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

export function QRCodeSection() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/menu`);
  }, []);

  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dragonfly-green/10 text-dragonfly-green text-sm font-medium mb-6">
          <span className="w-2 h-2 bg-dragonfly-green rounded-full status-pulse" />
          برای مشتریان
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-dragonfly-text mb-4">
          کد QR را اسکن کنید
        </h2>
        <p className="text-dragonfly-muted text-lg mb-10 max-w-md mx-auto">
          دوربین گوشی خود را روی کد QR زیر بگیرید یا مستقیماً به وبسایت ما مراجعه کنید.
        </p>

        <div className="inline-block p-8 bg-white rounded-3xl card-shadow">
          {url ? (
            <QRCodeSVG
              value={url}
              size={200}
              bgColor="#ffffff"
              fgColor="#4A3728"
              level="M"
              includeMargin={false}
            />
          ) : (
            <div className="w-[200px] h-[200px] bg-dragonfly-cream rounded-xl animate-pulse" />
          )}
          <p className="text-dragonfly-muted text-xs mt-4">
            {url || "در حال بارگذاری..."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="p-5 bg-white rounded-2xl card-shadow">
            <span className="text-3xl block mb-3">📱</span>
            <h3 className="font-semibold text-dragonfly-text text-sm mb-1">
              کد QR را اسکن کنید
            </h3>
            <p className="text-dragonfly-muted text-xs">
              دسترسی سریع از میز شما
            </p>
          </div>
          <div className="p-5 bg-white rounded-2xl card-shadow">
            <span className="text-3xl block mb-3">🛒</span>
            <h3 className="font-semibold text-dragonfly-text text-sm mb-1">
              سفارش دهید
            </h3>
            <p className="text-dragonfly-muted text-xs">
              مشاهده، انتخاب و سفارش
            </p>
          </div>
          <div className="p-5 bg-white rounded-2xl card-shadow">
            <span className="text-3xl block mb-3">✨</span>
            <h3 className="font-semibold text-dragonfly-text text-sm mb-1">
              تحویل بگیرید و لذت ببرید
            </h3>
            <p className="text-dragonfly-muted text-xs">
              با عشق برای شما آماده می‌کنیم
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
