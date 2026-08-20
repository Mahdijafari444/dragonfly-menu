"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const ADMIN_PASSWORD = "dragonfly2024";

export default function QRPrintPage() {
  const [url, setUrl] = useState("");
  const [showQR, setShowQR] = useState(false);
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);

  const handleAuth = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("رمز عبور اشتباه است");
    }
  };

  const handleGenerate = () => {
    if (!url) return;
    setShowQR(true);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-dragonfly-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 card-shadow max-w-sm w-full text-center">
          <span className="text-4xl block mb-4">🔒</span>
          <h1 className="text-lg font-semibold text-dragonfly-text mb-2">
            چاپ کد QR
          </h1>
          <p className="text-dragonfly-muted text-sm mb-6">
            رمز عبور مدیریت را وارد کنید
          </p>
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="w-full px-4 py-3 bg-dragonfly-cream rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20 mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 bg-dragonfly-brown text-white rounded-xl font-medium text-sm hover:bg-dragonfly-brown-light transition-colors"
            >
              ورود
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold text-dragonfly-text mb-2">
          🪰 دراگونفلای — ساخت کد QR
        </h1>
        <p className="text-dragonfly-muted text-sm mb-8">
          کد QR بسازید و روی میزها چاپ کنید
        </p>

        <div className="mb-6">
          <label className="block text-xs text-dragonfly-muted mb-2">
            آدرس وبسایت (لینکی که کد QR به آن وصل می‌شود)
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
placeholder="http://192.168.100.4:3000/welcome"
            className="w-full px-4 py-3 border border-dragonfly-taupe rounded-xl text-sm text-dragonfly-text placeholder:text-dragonfly-muted/50 focus:outline-none focus:ring-2 focus:ring-dragonfly-brown/20"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={!url}
          className="px-8 py-3 bg-dragonfly-brown text-white rounded-xl font-medium text-sm hover:bg-dragonfly-brown-light transition-colors disabled:opacity-40 mb-8"
        >
          ساخت کد QR
        </button>

        {showQR && (
          <div className="printable">
            <div className="inline-block p-8 bg-white border-2 border-dashed border-dragonfly-taupe rounded-2xl">
              <QRCodeSVG
                value={url}
                size={300}
                bgColor="#ffffff"
                fgColor="#4A3728"
                level="H"
                includeMargin={true}
              />
              <div className="mt-6">
                <p className="text-2xl font-bold text-dragonfly-brown">
                  دراگونفلای
                </p>
                <p className="text-dragonfly-muted text-sm mt-1">
                  منوی ما را با اسکن مشاهده کنید
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-dragonfly-brown text-white rounded-xl font-medium text-sm hover:bg-dragonfly-brown-light transition-colors"
              >
                🖨️ چاپ کد QR
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-dragonfly-taupe/30">
          <p className="text-dragonfly-muted text-xs">
            نکته: این صفحه را چاپ کنید، کد QR را ببرید و روی هر میز قرار دهید.
            <br />
            مشتریان آن را اسکن می‌کنند و مستقیماً وارد منو می‌شوند!
          </p>
        </div>
      </div>
    </div>
  );
}
