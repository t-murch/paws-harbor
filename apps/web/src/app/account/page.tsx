import ProfileForm from "@/components/ux/Profile/ProfileForm";
import React from "react";
import { getUserProfile } from "./actions";

export default async function AccountPage() {
  let profile = await getUserProfile();

  return (
    <div className="flex-1">
      {/* <h1>User Profile</h1> */}
      {profile && profile.user && <ProfileForm profile={profile.user} />}
    </div>
  );
}
