"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/authContext";

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [time, setTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "14px 24px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-primary)" }}>{title}</div>
        {subtitle && <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "1px" }}>{subtitle}</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span className="live-dot" />
          <span style={{ fontSize: "11px", color: "var(--accent-green)", fontWeight: "600", letterSpacing: "0.5px" }}>LIVE</span>
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>{time}</div>
        {user && (
          <div style={{ fontSize: "12px", color: "var(--text-secondary)", borderLeft: "1px solid var(--border)", paddingLeft: "16px" }}>
            <span style={{ color: "var(--text-muted)" }}>{user.role}: </span>
            <span style={{ fontWeight: "500" }}>{user.name}</span>
          </div>
        )}
        <div style={{ position: "relative", cursor: "pointer" }}>
          <span style={{ fontSize: "16px" }}>🔔</span>
          <span style={{ position: "absolute", top: "-4px", right: "-6px", background: "var(--accent-red)", color: "white", borderRadius: "10px", padding: "0 4px", fontSize: "9px", fontWeight: "700" }}>3</span>
        </div>
      </div>
    </div>
  );
}
