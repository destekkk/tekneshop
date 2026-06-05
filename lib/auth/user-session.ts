import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

export type UserSession = {
  isLoggedIn: boolean;
  userId: number;
  email: string;
  name: string;
};

function sessionPassword() {
  const raw = process.env.SESSION_SECRET || "tekneshop-dev-secret-min-32-chars!!";
  return raw.length >= 32 ? raw : raw.padEnd(32, "0");
}

export const userSessionOptions: SessionOptions = {
  password: sessionPassword(),
  cookieName: "tekneshop_user",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  },
};

export async function getUserSession() {
  const cookieStore = await cookies();
  return getIronSession<UserSession>(cookieStore, userSessionOptions);
}

export async function getCurrentUser() {
  const session = await getUserSession();
  if (!session.isLoggedIn || !session.userId) return null;
  return {
    id: session.userId,
    email: session.email,
    name: session.name,
  };
}

export async function requireUser(redirectTo?: string) {
  const { redirect } = await import("next/navigation");
  const user = await getCurrentUser();
  if (!user) {
    const dest = redirectTo ? `/giris?redirect=${encodeURIComponent(redirectTo)}` : "/giris";
    redirect(dest);
  }
  return user;
}
