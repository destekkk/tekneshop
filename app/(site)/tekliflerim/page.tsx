import { redirect } from "next/navigation";

export default function TekliflerimRedirect() {
  redirect("/teklifler?tab=verdigim");
}
