import ProfileForm from "../../components/ux/Profile/ProfileForm";
import { isFulfilled } from "../../lib/utils";
import { getUserPets, getUserProfile } from "./actions";
import { getUserServices } from "./actions/services";

export default async function AccountPage() {
  const [profile, pets, services] = await Promise.allSettled([
    getUserProfile(),
    getUserPets(),
    getUserServices(),
  ]);

  console.log(`profile: ${JSON.stringify(profile)}`);
  if (!isFulfilled(profile) || !profile.value?.user) {
    return <div>Profile not found</div>;
  }

  return (
    <div className="flex-1">
      {/* <h1>User Profile</h1> */}
      <ProfileForm
        profile={profile.value.user}
        pets={isFulfilled(pets) ? pets.value : []}
        services={isFulfilled(services) ? services.value : []}
      />
    </div>
  );
}
