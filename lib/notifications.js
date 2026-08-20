"use client";

import { useEffect, useRef, useCallback, createContext, useContext, useState } from "react";
import { playBellSound } from "@/lib/bell";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [muted, setMuted] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [newOrderCount, setNewOrderCount] = useState(0);
  const prevOrdersRef = useRef(null);
  const initializedRef = useRef(false);

  const toggleMute = useCallback(() => {
    setMuted((prev) => !prev);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/orders");
        if (!res.ok) return;
        const orders = await res.json();

        if (!initializedRef.current) {
          // First load — just store current state, don't play sound
          prevOrdersRef.current = orders.map((o) => o.id);
          initializedRef.current = true;
          return;
        }

        const prevIds = new Set(prevOrdersRef.current || []);
        const newOrders = orders.filter((o) => !prevIds.has(o.id));

        if (newOrders.length > 0 && !muted) {
          playBellSound();
          setLastOrderId(newOrders[0].id);
          setNewOrderCount((c) => c + newOrders.length);
        }

        prevOrdersRef.current = orders.map((o) => o.id);
      } catch {
        // ignore fetch errors
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [muted]);

  const clearNewOrderCount = useCallback(() => {
    setNewOrderCount(0);
  }, []);

  return (
    <NotificationsContext.Provider
      value={{ muted, toggleMute, newOrderCount, lastOrderId, clearNewOrderCount }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be inside NotificationsProvider");
  return ctx;
}
