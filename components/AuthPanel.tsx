"use client";

import { useState } from "react";
import LoginForm from "@/components/LoginForm";
import RegisterForm from "@/components/RegisterForm";

type Tab = "login" | "register";

export default function AuthPanel({ defaultTab = "login" }: { defaultTab?: Tab }) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => setTab("login")}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "login"
              ? "border-b-2 border-navy bg-white text-navy"
              : "bg-[#fafafa] text-muted hover:text-foreground"
          }`}
        >
          Giriş Yap
        </button>
        <button
          type="button"
          onClick={() => setTab("register")}
          className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
            tab === "register"
              ? "border-b-2 border-navy bg-white text-navy"
              : "bg-[#fafafa] text-muted hover:text-foreground"
          }`}
        >
          Kayıt Ol
        </button>
      </div>
      {tab === "login" ? <LoginForm /> : <RegisterForm embedded />}
    </div>
  );
}
