import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  existingPetSchema,
  Pet,
  PetSizeNames,
  PetSizes,
  PetSizeScales,
} from "@/lib/types";
import { useAtom } from "jotai";
import { petEditAtomFamily } from "@/components/ux/providers/store";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePetInfoAction } from "@/app/account/actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import data from "@/lib/dogs.json";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

interface PetProps {
  pet: Pet;
}

const dogBreeds = data.map((val) => val.Breed);
const formatPetScale = ([k, val]: [k: PetSizeNames, thing: PetSizeScales]) => {
  if (val[1] === Infinity) return `${k} - ${val[0]}+ lbs.`;
  return `${k} - ${val[0]} - ${val[1]} lbs`;
};
const ageRange = new Array(30).fill(null).map((_val, idx) => idx + 1);
const petSizeDropDownRecords = Object.entries(PetSizes).map(([k, v]) => {
  const key = k as PetSizeNames;
  return {
    value: key,
    label: formatPetScale([key, v]),
  };
});

const PetBio: React.FC<PetProps> = ({ pet }) => {
  const [formState, formAction] = useFormState(updatePetInfoAction, {
    message: "",
    fields: {},
  });
  const form = useForm<z.infer<typeof existingPetSchema>>({
    resolver: zodResolver(existingPetSchema),
    defaultValues: {
      age: 1,
      name: "",
      breed: "",
      species: "dog",
      specialNeeds: "",
      ...(formState?.fields ?? {}),
    },
  });
  const [editMode, setEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [thisPet, setPet] = useAtom(petEditAtomFamily(pet.id)); // Use the dynamic atom for each pet

  const toggleEditMode = () => {
    setEditMode((state) => !state);
  };

  return (
    !!thisPet && (
      <div className="mb-4">
        <h3 className="text-lg font-bold">Pet Info</h3>
        {editMode ? (
          <>
            <Form {...form}>
              <form ref={formRef} action={formAction}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input data-testid="Name" {...field} />
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
                          <SelectItem key="dog" value="dog">
                            dog
                          </SelectItem>
                          <SelectItem key="cat" value="cat">
                            cat
                          </SelectItem>
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
                          {dogBreeds.map((breed, idx) => {
                            return (
                              <SelectItem key={idx} value={breed}>
                                {breed}
                              </SelectItem>
                            );
                          })}
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
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={`${field.value}`}
                        value={`${field.value}`}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ageRange.map((age) => {
                            return (
                              <SelectItem key={age} value={`${age}`}>
                                {age}
                              </SelectItem>
                            );
                          })}
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
                          <SelectItem value={"male"}>male</SelectItem>
                          <SelectItem value={"female"}>female</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
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
                          {petSizeDropDownRecords.map((size) => {
                            return (
                              <SelectItem key={size.value} value={size.value}>
                                {size.label}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialNeeds"
                  render={({ field }) => (
                    <FormItem className="col-span-2 mb-2">
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
                  <Button
                    variant={"secondary"}
                    onClick={toggleEditMode}
                    type="button"
                  >
                    {"Cancel"}
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <section className="grid grid-cols-2">
            <div className="flex flex-row col-span-2 gap-4">
              <strong> Name:</strong> {thisPet.name}
            </div>
            <div className="flex flex-row gap-4">
              <strong> Age:</strong> {thisPet.age}
            </div>
            <div className="flex flex-row gap-4">
              <strong> Species: </strong> {thisPet.species}
            </div>
            <div className="flex flex-row col-span-2 gap-4">
              <strong> Breed:</strong> {thisPet.breed}
            </div>
            <div className="flex flex-row gap-4">
              <strong> Sex:</strong> {thisPet.sex}
            </div>
            <div className="flex flex-row gap-4">
              <strong> Size:</strong> {thisPet.size}
            </div>
            {thisPet.specialNeeds && (
              <div className="flex flex-row col-span-2 gap-4">
                <strong> Special Needs:</strong> {thisPet.specialNeeds}
              </div>
            )}
          </section>
        )}
        <div className="flex justify-end">
          {!editMode && (
            <Button onClick={toggleEditMode}>
              Edit
              {/* {editMode ? "Save" : "Edit"} */}
            </Button>
          )}
        </div>
      </div>
    )
  );
};

export default PetBio;
