"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Dog } from "lucide-react";
import React from "react";
import PetList from "./Petlist";
import { testPet } from "../providers/store";
import Bio from "./Bio";
import { UserProfile } from "../atoms";

export const testUser: UserProfile = {
  id: "123",
  name: "Tobias Ruffin",
  address: "123 BrownTree Trail Leander, TX 78641",
  email: "toberuffin@domain.com",
  // pets: [testPet],
  phoneNumber: "253-111-1234",
  role: "",
  profilePictureUrl: null,
  bio: null,
  createdAt: null,
  updatedAt: null,
  // services: [],
};

const MyAvatar = () => <AvatarIcon className="w-16 h-16" />;
const editButtonState = (isEditMode: boolean) => (isEditMode ? "Save" : "Edit");

export type UserJSONResponse = {
  data: { user: UserProfile | null };
  error: any;
};

export type SectionEditMode = {
  user: boolean;
  pet: boolean;
  service: boolean;
};

type ProfileFormProps = {
  profile: UserProfile;
};
const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
}: ProfileFormProps) => {
  // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setProfile((prevProfile) =>
  //     prevProfile ? { ...prevProfile, [name]: value } : null,
  //   );
  // };
  //
  // const toggleEditMode = (section: keyof SectionEditMode) => {
  //   setEditMode((prevState) => ({
  //     ...prevState,
  //     [section]: !prevState[section],
  //   }));
  // };

  // const handleSave = async () => {
  //   if (profile) {
  //     const { data, error } = await supabaseClient
  //       .from("profiles")
  //       .update(profile)
  //       .eq("id", profile.id);
  //
  //     if (error) {
  //       console.error("Error updating profile:", error);
  //     } else {
  //       alert("Profile updated successfully");
  //     }
  //   }
  // };

  // if (!profile) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-6 h-20">
        <Dog className="w-16 h-16" />
        <MyAvatar />
      </div>
      <Bio userProfile={profile} />

      <Card>
        <CardHeader className="items-end font-bold">Pets</CardHeader>
        <CardContent>
          <PetList pets={[testPet]} />
        </CardContent>
      </Card>
      {/* <ServiceList services={profile.services} /> */}
    </div>
  );
};

export default ProfileForm;
