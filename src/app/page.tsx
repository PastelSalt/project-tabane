import { redirect } from "next/navigation";

// The Library is the home page.
export default function Home() {
  redirect("/library");
}
