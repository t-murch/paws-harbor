import ProfileForm from "@/components/ux/Profile/ProfileForm";
import React from "react";
import { getUserPets, getUserProfile } from "./actions";
import { getUserServices } from "./actions/services";

export default async function AccountPage() {
  let profile = await getUserProfile();
  let pets = await getUserPets();
  let services = await getUserServices();

  return (
    <div className="flex-1">
      {/* <h1>User Profile</h1> */}
      {profile && profile.user && (
        <ProfileForm
          profile={profile.user}
          pets={pets ?? []}
          services={services}
        />
      )}
    </div>
  );
}
