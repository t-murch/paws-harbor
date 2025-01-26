import { supabaseServerClient } from "../../lib/supabase/server";

export default async function PrivatePage() {
  const { data } = await supabaseServerClient.auth.getUser();
  // if (error || !data?.user) {
  //   redirect("/login");
  // }

  return <p>Hello {data?.user?.email}</p>;
}
