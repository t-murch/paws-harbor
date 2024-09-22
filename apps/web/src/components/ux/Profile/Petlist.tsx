import { Pet } from "@/lib/types";
import React from "react";
import PetBio from "./Pet";

interface PetListProps {
  pets: Pet[];
}

const PetList: React.FC<PetListProps> = ({ pets }) => {
  return (
    <>
      {pets.map((pet) => (
        <PetBio key={pet.id} pet={pet} />
      ))}
    </>
  );
};

export default PetList;
