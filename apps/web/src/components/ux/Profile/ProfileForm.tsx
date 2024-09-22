"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AvatarIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { Dog } from "lucide-react";
import React, { useEffect } from "react";
import { userAtom, UserProfile } from "../atoms";
import { testPet } from "../providers/store";
import Bio from "./Bio";
import PetList from "./Petlist";

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
  profile?: UserProfile;
};
const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
}: ProfileFormProps) => {
  const [globalUser, setGlobalUser] = useAtom(userAtom);

  useEffect(() => {
    if (profile && profile) setGlobalUser(profile);
  }, [profile, setGlobalUser]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center gap-6 h-20">
        <Dog className="w-16 h-16" />
        <MyAvatar />
      </div>
      {globalUser && <Bio userProfile={globalUser} />}

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
