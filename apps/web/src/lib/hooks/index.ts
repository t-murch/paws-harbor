import { useQuery } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { sessionAtom } from "@/components/ux/providers/store";
import { API_HOST } from "../utils";
import { UserJSONResponse } from "@/components/ux/Profile/ProfileForm";
import { userAtom } from "@/components/ux/atoms";

// Fetch user profile based on the session
export const useUserProfile = () => {
  const session = useAtomValue(sessionAtom);
  const [user, setUser] = useAtom(userAtom);

  const query = useQuery({
    queryKey: ["userProfile", { userId: session?.user.id }],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const res = await fetch(`${API_HOST}/users/profile`, {
        method: "GET",
        credentials: "include",
      });

      const { data, error }: UserJSONResponse = await res.json();
      if (error) throw new Error(error.message);

      return data;
    },
    enabled: !!session?.user.id, // Only run the query if there's a user
  });

  if (query.data?.user && user !== query.data.user) setUser(query.data.user);

  return query;
};
