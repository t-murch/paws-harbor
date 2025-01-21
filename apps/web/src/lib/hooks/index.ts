import { UserJSONResponse } from "@/components/ux/Profile/ProfileForm";
import { userAtom } from "@/components/ux/atoms";
import { sessionAtom } from "@/components/ux/providers/store";
import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { API_HOST } from "../utils";

// Fetch user profile based on the session
export const useUserProfile = () => {
  const session = useAtomValue(sessionAtom);
  const [user, setUser] = useAtom(userAtom);

  const query = useQuery({
    enabled: !!session?.user.id, // Only run the query if there's a user
    queryFn: async () => {
      if (!session?.user.id) return null;
      const res = await fetch(`${API_HOST}/users/profile`, {
        credentials: "include",
        method: "GET",
      });

      const { data, error }: UserJSONResponse = await res.json();
      if (error) throw new Error(error.message);

      return data;
    },
    queryKey: ["userProfile", { userId: session?.user.id }],
  });

  if (query.data?.user && user !== query.data.user) setUser(query.data.user);

  return query;
};
