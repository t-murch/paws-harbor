"use client";

import { AvatarIcon } from "@radix-ui/react-icons";
import { Service } from "@repo/shared/db/schemas/services";
import { useAtom } from "jotai";
import { Dog } from "lucide-react";
import React, { useEffect } from "react";
import { Pet, ServiceFormData } from "../../../lib/types";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { userAtom, UserProfile } from "../atoms";
import { petsAtom } from "../providers/store";
import Bio from "./Bio";
import PetComponent from "./Pet";

const MyAvatar = () => <AvatarIcon className="w-16 h-16" />;

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
  pets: Pet[];
  services: Service[];
};
const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  pets,
  // services,
}: ProfileFormProps) => {
  const [globalUser, setGlobalUser] = useAtom(userAtom);
  const [allPets, setAllPets] = useAtom(petsAtom);

  useEffect(() => {
    if (profile) setGlobalUser(profile);
  }, [profile, setGlobalUser]);

  useEffect(() => {
    if (pets.length) setAllPets(pets);
  });

  // eslint-disable-next-line no-unused-vars
  const handleSaveServices = (updatedServices: ServiceFormData["services"]) => {
    // Handle saving the updated services, e.g., sending to an API
    console.log("Saving services:", updatedServices);
  };

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
          {allPets &&
            globalUser &&
            allPets.map((pet) => {
              return (
                <PetComponent key={pet.id} pet={pet} userId={globalUser.id} />
              );
            })}
          {globalUser && <PetComponent userId={globalUser.id} />}
        </CardContent>
      </Card>
      {/* Bring back ServiceList as `ActiveServices` */}
    </div>
  );
};

export default ProfileForm;
