"use client";

import { createPetFormAction } from "@/app/account/actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  newPetSchema,
  Pet,
  PetSizeNames,
  PetSizes,
  PetSizeScales,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { log } from "@repo/logger";
import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import data from "@/lib/dogs.json";
import { Textarea } from "@/components/ui/textarea";

interface NewPetProps {
  pet?: Pet;
}

const dogBreeds = data.map((val) => val.Breed);

const formatPetScale = ([k, val]: [k: PetSizeNames, thing: PetSizeScales]) => {
  if (val[1] === Infinity) return `${k} - ${val[0]}+ lbs.`;
  return `${k} - ${val[0]} - ${val[1]} lbs`;
};

const petSizeDropDownRecords = Object.entries(PetSizes).map(([k, v]) => {
  const key = k as PetSizeNames;
  return {
    value: key,
    label: formatPetScale([key, v]),
  };
});

const ageRange = new Array(30).fill(null).map((_val, idx) => idx + 1);

const NewPetBio: React.FC<NewPetProps> = () => {
  const [formState, formAction] = useFormState(createPetFormAction, {
    message: "",
    fields: {},
  });
  const form = useForm<z.infer<typeof newPetSchema>>({
    resolver: zodResolver(newPetSchema),
    defaultValues: {
      age: `${1}`,
      name: "",
      breed: "",
      species: "dog",
      specialNeeds: "",
      ...(formState?.fields ?? {}),
    },
  });
  const [editMode, setEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // const [globalPets, setGlobalPets] = useAtom(petsAtom);

  const toggleEditMode = () => {
    setEditMode((state) => !state);
  };

  log(`form errors=${JSON.stringify(form.formState.errors, null, 2)}`);
  if (formRef.current) {
    log(
      `formRef on submit=${JSON.stringify(new FormData(formRef.current), null, 2)}`,
    );
  }
  log(`message prop=${JSON.stringify(formState, null, 2)}`);
  return editMode ? (
    <div className="mb-4">
      <h3 className="text-lg font-bold">Pet Info</h3>
      <Form {...form}>
        <form
          className="grid grid-cols-2 gap-2"
          ref={formRef}
          action={formAction}
          onSubmit={(evt) => {
            evt.preventDefault();
            form.handleSubmit(() => {
              return new Promise((resolve) => {
                formAction(new FormData(formRef.current!));
              });
            })(evt);
          }}
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
    </div>
  ) : (
    <div>
      <Button onClick={() => setEditMode((currentState) => !currentState)}>
        Add New Pet
      </Button>
    </div>
  );
};

export default NewPetBio;
