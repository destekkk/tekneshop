"use client";

import { useTransition } from "react";
import { logoutUserAction } from "@/lib/user-actions";

export default function UserLogoutButton() {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => start(() => logoutUserAction())}
      className="whitespace-nowrap px-3 py-2 text-[10px] text-foreground hover:text-navy disabled:opacity-50"
    >
      {pending ? "Çıkış…" : "Çıkış"}
    </button>
  );
}
