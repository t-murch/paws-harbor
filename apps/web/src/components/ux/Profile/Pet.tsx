import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pet } from "@/lib/types";
import { useAtom } from "jotai";
import { petEditAtomFamily } from "@/components/ux/providers/store";
import { useState } from "react";

interface PetProps {
  pet: Pet;
}

const PetBio: React.FC<PetProps> = ({ pet }) => {
  const [editMode, setEditMode] = useState(false);
  const [thisPet, setPet] = useAtom(petEditAtomFamily(pet.id)); // Use the dynamic atom for each pet

  const handleEdit = <K extends keyof Pet>(field: K, value: Pet[K]) => {
    if (!thisPet) return;
    const updatedPet: Pet = { ...thisPet, [field]: value };
    setPet(updatedPet);
  };

  const toggleEditMode = () => {
    setEditMode((state) => !state);
  };

  return (
    !!thisPet && (
      <div className="mb-4">
        <h3 className="text-lg font-bold">Pet Info</h3>
        {editMode ? (
          <>
            <Label htmlFor="petName">Name</Label>
            <Input
              id="petName"
              name="petName"
              value={thisPet.name || ""}
              onChange={() => handleEdit("name", thisPet.name)}
              className="mb-2"
            />

            <Label htmlFor="petBreed">Breed</Label>
            <Input
              id="petBreed"
              name="petBreed"
              value={thisPet.breed || ""}
              onChange={() => handleEdit("breed", thisPet.breed)}
              className="mb-2"
            />

            <Label htmlFor="petAge">Age</Label>
            <Input
              id="petAge"
              name="petAge"
              value={thisPet.age || ""}
              onChange={() => handleEdit("age", thisPet.age)}
              className="mb-2"
            />

            <Label htmlFor="petSize">Size</Label>
            <Input
              id="petSize"
              name="petSize"
              value={thisPet.size || ""}
              onChange={() => handleEdit("size", thisPet.size)}
              className="mb-2"
            />
          </>
        ) : (
          <div>
            <p className="grid grid-cols-2 grid-rows-3">
              <strong> Name:</strong> {thisPet.name}
              <strong> Age:</strong> {thisPet.age}
              <strong> Breed:</strong> {thisPet.breed}
              <strong> Gender:</strong> {thisPet.gender}
              <strong> Size:</strong> {thisPet.size}
            </p>
          </div>
        )}
        <div className="flex justify-end">
          <Button onClick={toggleEditMode}>{editMode ? "Save" : "Edit"}</Button>
        </div>
      </div>
    )
  );
};

export default PetBio;
