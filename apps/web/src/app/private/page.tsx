import { supabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  const { data, error } = await supabaseServerClient.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  return <p>Hello {data.user.email}</p>;
}
