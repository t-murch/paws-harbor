export type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat";
  breed?: string;
  age?: number;
  weight?: number;
  specialNeeds?: string;
};

export type Service = {
  id: string;
  type: "pet-walking" | "pet-sitting" | "pet-bathing";
  frequency: "a-la-carte" | "recurring-monthly";
  notes?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  pets: Pet[];
  services: Service[];
};
