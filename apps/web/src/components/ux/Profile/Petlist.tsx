import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pet } from "@/lib/types";
import React from "react";

interface PetListProps {
  pets: Pet[];
}

const PetList: React.FC<PetListProps> = ({ pets }) => {
  return (
    <div>
      <h3>Pets</h3>
      {pets.map((pet) => (
        <div key={pet.id}>
          <Label>Name</Label>
          <Input value={pet.name} readOnly />

          <Label>Species</Label>
          <Input value={pet.species} readOnly />

          <Label>Breed</Label>
          <Input value={pet.breed || ""} readOnly />

          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default PetList;
