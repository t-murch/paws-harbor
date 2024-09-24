import { Pet } from "@/lib/types";
import React from "react";
import PetBio from "./Pet";
import NewPetBio from "./NewPet";

interface PetListProps {
  pets: Pet[];
}

const PetList: React.FC<PetListProps> = ({ pets }) => {
  return (
    <>
      {pets.map((pet) => (
        <PetBio key={pet.id} pet={pet} />
      ))}
      <NewPetBio />
    </>
  );
};

export default PetList;
