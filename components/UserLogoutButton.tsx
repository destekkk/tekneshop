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
      className="whitespace-nowrap px-4 py-2.5 text-[13px] text-foreground hover:text-navy disabled:opacity-50"
    >
      {pending ? "Çıkış…" : "Çıkış"}
    </button>
  );
}
