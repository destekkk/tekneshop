import { redirect } from "next/navigation";

export default function GelenTekliflerRedirect() {
  redirect("/mesajlar?tab=teklifler");
}
