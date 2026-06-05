import Link from "next/link";
import { getCurrentUser } from "@/lib/auth/user-session";
import UserLogoutButton from "@/components/UserLogoutButton";

export default async function HeaderAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <>
        <span className="max-w-[140px] truncate px-2 text-[14px] text-foreground" title={user.email}>
          {user.name}
        </span>
        <UserLogoutButton />
        <Link
          href="/ilan-ver"
          className="btn-cta whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
        >
          Ücretsiz İlan Ver
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/giris?tab=kayit"
        className="whitespace-nowrap px-4 py-2.5 text-[14px] text-foreground hover:text-navy"
      >
        Kayıt Ol
      </Link>
      <Link
        href="/giris"
        className="whitespace-nowrap px-4 py-2.5 text-[14px] text-foreground hover:text-navy"
      >
        Giriş Yap
      </Link>
      <Link
        href="/ilan-ver"
        className="btn-cta whitespace-nowrap rounded-sm px-5 py-2.5 text-[14px]"
      >
        Ücretsiz İlan Ver
      </Link>
    </>
  );
}
