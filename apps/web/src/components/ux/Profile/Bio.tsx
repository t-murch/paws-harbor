"use client";

import { log } from "@repo/logger";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { updateUserProfile } from "../../../app/account/actions";
import { Button } from "../../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { userAtom, UserProfile } from "../atoms";

type BioProps = { userProfile: UserProfile };

const Bio: React.FC<BioProps> = ({ userProfile }: BioProps) => {
  const setGlobalUser = useSetAtom(userAtom);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (!profile && !!userProfile) setProfile(userProfile);
  }, [profile, userProfile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) =>
      prevProfile ? { ...prevProfile, [name]: value } : null,
    );
  };

  const handleSave = async () => {
    if (profile) {
      const res = await updateUserProfile(profile);
      if (res) {
        log(`User Updated.`);
        setGlobalUser(profile);
      }
    }
  };

  return (
    profile && (
      <Card className="flex flex-col min-h-96">
        <CardHeader>
          <div>
            <div className="flex justify-end font-bold">
              {profile.name ?? "John Smith"}
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="mb-4">
            {/* <h3 className="text-lg font-bold">User Info</h3> */}
            {editMode ? (
              <>
                <Label htmlFor="email">
                  <strong>Email:</strong>
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={profile.email}
                  className="mb-2"
                  disabled
                />
                <Label htmlFor="address">
                  <strong>Address:</strong>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={profile?.address ?? ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
                <Label htmlFor="phoneNumber">
                  <strong>Phone:</strong>
                </Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile?.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="mb-2"
                />
              </>
            ) : (
              <div>
                <p className="flex flex-col">
                  <span className="text-sm font-bold">Email:</span>
                  <span className="pl-1">{profile.email}</span>
                </p>
                <p className="flex flex-col">
                  <span className="text-sm font-bold">Address:</span>
                  <span className="pl-1">{profile?.address}</span>
                </p>
                <p className="flex flex-col">
                  <span className="text-sm font-bold">Phone:</span>
                  <span className="pl-1">{profile?.phoneNumber}</span>
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <div className="flex gap-4">
            {editMode && (
              <Button
                className="min-w-20"
                onClick={() => {
                  setProfile(userProfile);
                  return setEditMode((currentMode) => !currentMode);
                }}
                variant={"secondary"}
              >
                Cancel
              </Button>
            )}
            <Button
              className="min-w-20"
              onClick={async () => {
                if (editMode) await handleSave();
                return setEditMode((currentMode) => !currentMode);
              }}
            >
              {editMode ? "Save" : "Edit"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    )
  );
};

export default Bio;
