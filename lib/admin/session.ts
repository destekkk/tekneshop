import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type AdminSession = {
  isLoggedIn: boolean;
  email: string;
};

function sessionPassword() {
  const raw = process.env.SESSION_SECRET || "tekneshop-dev-secret-min-32-chars!!";
  return raw.length >= 32 ? raw : raw.padEnd(32, "0");
}

export const sessionOptions: SessionOptions = {
  password: sessionPassword(),
  cookieName: "tekneshop_admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  },
};

export async function getAdminSession() {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions);
}

export async function requireAdmin() {
  const { redirect } = await import("next/navigation");
  const session = await getAdminSession();
  if (!session.isLoggedIn) {
    redirect("/admin/login");
  }
  return session;
}
