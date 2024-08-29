"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabaseClient } from "@/lib/supabase/client";
import { UserProfile } from "@/lib/types";
import React, { useState, useEffect } from "react";
import PetList from "./Petlist";
import ServiceList from "./ServiceList";
import { Button } from "@/components/ui/button";

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     const { data, error } = await supabaseClient
  //       .from<UserProfile>("profiles")
  //       .select("*")
  //       .single();
  //
  //     if (error) {
  //       console.error("Error fetching profile:", error);
  //     } else {
  //       setProfile(data);
  //     }
  //   };
  //
  //   fetchUserProfile();
  // }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) =>
      prevProfile ? { ...prevProfile, [name]: value } : null,
    );
  };

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

  if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <Label>Name</Label>
      <Input name="name" value={profile.name} onChange={handleInputChange} />

      <Label>Email</Label>
      <Input name="email" value={profile.email} disabled />

      <Label>Address</Label>
      <Input
        name="address"
        value={profile.address || ""}
        onChange={handleInputChange}
      />

      <Label>Phone Number</Label>
      <Input
        name="phoneNumber"
        value={profile.phoneNumber || ""}
        onChange={handleInputChange}
      />

      <PetList pets={profile.pets} />
      <ServiceList services={profile.services} />

      <Button
      // onClick={handleSave}
      >
        Save
      </Button>
    </div>
  );
};

export default ProfileForm;
