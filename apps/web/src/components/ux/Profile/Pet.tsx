import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { Form, useForm } from "react-hook-form";
import { z } from "zod";
import {
  createPetFormAction,
  deletePet,
  updatePetInfoAction,
} from "../../../app/account/actions";
import cats from "../../../lib/cats.json";
import dogs from "../../../lib/dogs.json";
import { Pet, PetSizeNames, PetSizeScales, PetSizes } from "../../../lib/types";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Textarea } from "../../ui/textarea";
import { petEditAtomFamily } from "../providers/store";

const dogBreeds = dogs.map((val) => val.Breed);
const catBreeds = cats.map((val) => val.breed);

const formatPetScale = ([k, val]: [k: PetSizeNames, thing: PetSizeScales]) => {
  if (val[1] === Infinity) return `${k} - ${val[0]}+ lbs.`;
  return `${k} - ${val[0]} - ${val[1]} lbs`;
};

export const petSizeDropDownRecords = Object.entries(PetSizes).map(([k, v]) => {
  const key = k as PetSizeNames;
  return {
    label: formatPetScale([key, v]),
    value: key,
  };
});

const ageRange = new Array(30).fill(null).map((_val, idx) => idx + 1);

const petSchema = z.object({
  age: z.union([z.number(), z.string().pipe(z.coerce.number())]),
  breed: z.string().min(1, "Breed is required"),
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  sex: z.enum(["male", "female"]),
  size: z.enum(["tiny", "small", "medium", "large", "giant"]),
  specialNeeds: z.string().optional(),
  species: z.enum(["dog", "cat"]),
  userId: z.string(),
});

interface PetProps {
  pet?: Pet;
  userId: string;
}

const PetComponent: React.FC<PetProps> = ({ pet, userId }) => {
  const [editMode, setEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [thisPet] = useAtom(
    pet ? petEditAtomFamily(pet.id) : petEditAtomFamily(""),
  );
  const [formState, formAction] = useFormState(
    pet ? updatePetInfoAction : createPetFormAction,
    {
      fields: {},
      message: "",
    },
  );

  const form = useForm<z.infer<typeof petSchema>>({
    defaultValues: {
      age: thisPet?.age ?? 1,
      breed: thisPet?.breed ?? "",
      id: pet?.id,
      name: thisPet?.name ?? "",
      sex: thisPet?.sex ?? "male",
      size: thisPet?.size ?? "medium",
      specialNeeds: thisPet?.specialNeeds ?? "",
      species: thisPet?.species ?? "dog",
      userId,
      ...(formState?.fields ?? {}),
    },
    resolver: zodResolver(petSchema),
  });

  const [breeds, setBreeds] = useState<string[]>(dogBreeds);

  useEffect(() => {
    if (formState.message === "success") {
      form.reset();
      setEditMode(false);
    }
  }, [form, formState]);

  const toggleEditMode = () => setEditMode((state) => !state);

  const handleSubmit = form.handleSubmit(() => {
    return new Promise<void>((resolve) => {
      const formData = new FormData(formRef.current!);
      if (pet?.id) formData.append("id", pet.id);
      formData.append("userId", userId);
      formAction(formData);
      resolve();
    });
  });

  const handleDelete = async () => {
    if (pet?.id) {
      const response = await deletePet(pet.id);
      console.debug(`delete response: ${JSON.stringify(response)}`);
    }
  };

  if (!editMode && thisPet) {
    return (
      <div className="mb-4">
        <h3 className="text-lg font-bold">Pet Info</h3>
        <section className="grid grid-cols-2">
          <div className="flex flex-row col-span-2 gap-4">
            <strong>Name:</strong> {thisPet.name}
          </div>
          <div className="flex flex-row gap-4">
            <strong>Age:</strong> {thisPet.age}
          </div>
          <div className="flex flex-row gap-4">
            <strong>Species:</strong> {thisPet.species}
          </div>
          <div className="flex flex-row col-span-2 gap-4">
            <strong>Breed:</strong> {thisPet.breed}
          </div>
          <div className="flex flex-row gap-4">
            <strong>Sex:</strong> {thisPet.sex}
          </div>
          <div className="flex flex-row gap-4">
            <strong>Size:</strong> {thisPet.size}
          </div>
          {thisPet.specialNeeds && (
            <div className="flex flex-row col-span-2 gap-4">
              <strong>Special Needs:</strong> {thisPet.specialNeeds}
            </div>
          )}
        </section>
        <div className="flex gap-2 justify-end">
          <Button onClick={handleDelete}>Delete</Button>
          <Button onClick={toggleEditMode}>Edit</Button>
        </div>
      </div>
    );
  }

  if (!editMode && !thisPet) {
    return <Button onClick={toggleEditMode}>Add New Pet</Button>;
  }

  return (
    <div className="mb-4">
      <h3 className="text-lg font-bold">{pet ? "Edit Pet" : "Add New Pet"}</h3>
      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-2"
          ref={formRef}
          action={formAction}
          onSubmit={handleSubmit}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input data-testid="Name" placeholder="Day-Z" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Species</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const b = value === "dog" ? dogBreeds : catBreeds;
                    setBreeds(b);
                  }}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">dog</SelectItem>
                    <SelectItem value="cat">cat</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem className="col-span-1">
                <FormLabel>Breed</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {breeds.map((breed, idx) => (
                      <SelectItem key={idx} value={breed}>
                        {breed}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  defaultValue={`${field.value}`}
                  {...field}
                  value={`${field.value}`}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ageRange.map((age) => (
                      <SelectItem key={age} value={`${age}`}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">male</SelectItem>
                    <SelectItem value="female">female</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  {...field}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {petSizeDropDownRecords.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialNeeds"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Special Needs</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any special needs for the fur baby?"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="col-start-2 flex justify-end gap-4">
            <Button variant="secondary" onClick={toggleEditMode} type="button">
              Cancel
            </Button>
            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting ? (
                <ReloadIcon className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PetComponent;
