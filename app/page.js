import { redirect } from "next/navigation";

// The root page redirects to /menu
// Customers scan the QR code on the table → goes straight to the menu
export default function Home() {
  redirect("/menu");
}
