
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/lib/types";
import { API_HOST } from "@/lib/utils";
import { AvatarIcon } from "@radix-ui/react-icons";
import { log } from "@repo/logger";
import { Dog } from "lucide-react";
import React, { useEffect, useState } from "react";

const MyAvatar = () => <AvatarIcon className="w-16 h-16" />;

type SectionEditMode = {
  user: boolean;
  pet: boolean;
  service: boolean;
};

const ProfileForm: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<SectionEditMode>({
    user: false,
    pet: false,
    service: false,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await fetch(\`\${API_HOST}/users/profile\`, {
        method: "GET",
        credentials: "include",
      });

      const { data, error } = await res.json();
      if (!res.ok) {
        log(\`Failed to fetch Profile. Error=\${error?.message ?? error ?? ""}\`);
      }
      setProfile(data.user);
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) =>
      prevProfile ? { ...prevProfile, [name]: value } : null
    );
  };

  const toggleEditMode = (section: keyof SectionEditMode) => {
    setEditMode((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  return (
    <Card>
      <CardHeader>
        <h2>Profile</h2>
        <MyAvatar />
      </CardHeader>
      <CardContent>
        {/* User Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">User Info</h3>
          {editMode.user ? (
            <>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={profile?.username || ""}
                onChange={handleInputChange}
                className="mb-2"
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={profile?.email || ""}
                onChange={handleInputChange}
                className="mb-2"
              />
            </>
          ) : (
            <div>
              <p><strong>Username:</strong> {profile?.username}</p>
              <p><strong>Email:</strong> {profile?.email}</p>
            </div>
          )}
          <Button onClick={() => toggleEditMode("user")}>
            {editMode.user ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Pet Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Pet Info</h3>
          {editMode.pet ? (
            <>
              <Label htmlFor="petName">Pet Name</Label>
              <Input
                id="petName"
                name="petName"
                value={profile?.petName || ""}
                onChange={handleInputChange}
                className="mb-2"
              />
            </>
          ) : (
            <div>
              <p><strong>Pet Name:</strong> {profile?.petName}</p>
            </div>
          )}
          <Button onClick={() => toggleEditMode("pet")}>
            {editMode.pet ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Service Section */}
        <div className="mb-4">
          <h3 className="text-lg font-bold">Service Info</h3>
          {editMode.service ? (
            <>
              <Label htmlFor="serviceType">Service Type</Label>
              <Input
                id="serviceType"
                name="serviceType"
                value={profile?.serviceType || ""}
                onChange={handleInputChange}
                className="mb-2"
              />
            </>
          ) : (
            <div>
              <p><strong>Service Type:</strong> {profile?.serviceType}</p>
            </div>
          )}
          <Button onClick={() => toggleEditMode("service")}>
            {editMode.service ? "Save" : "Edit"}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        {/* Additional actions if needed */}
      </CardFooter>
    </Card>
  );
};

export default ProfileForm;
