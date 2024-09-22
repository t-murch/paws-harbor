export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed: string;
  age?: number;
  weight?: number;
  specialNeeds?: string;
  gender: "male" | "female";
  size: PetSizeNames;
};

export const PetSizes = {
  small: [0, 15],
  medium: [16, 40],
  large: [41, 100],
  giant: [101, Infinity],
} as const;

export type PetSizeNames = keyof typeof PetSizes;

export type Service = {
  id: string;
  type: "pet-walking" | "pet-sitting" | "pet-bathing";
  frequency: "a-la-carte" | "recurring-monthly";
  notes?: string;
};

export type UserProfile2 = {
  id: string;
  name: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  pets: Pet[];
  services: Service[];
};
