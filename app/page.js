import { redirect } from "next/navigation";

// Root redirects to the welcome animation page
// Customers scan QR → see welcome animation → go to menu
export default function Home() {
  redirect("/welcome");
}
