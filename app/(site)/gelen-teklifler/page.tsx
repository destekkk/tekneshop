import { redirect } from "next/navigation";

export default function GelenTekliflerRedirect() {
  redirect("/teklifler?tab=gelen");
}
