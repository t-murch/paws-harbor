import { deletePet, updatePetInfoAction } from "@/app/account/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { petEditAtomFamily } from "@/components/ux/providers/store";
import data from "@/lib/dogs.json";
import {
  existingPetSchema,
  Pet,
  PetSizeNames,
  PetSizes,
  PetSizeScales,
} from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface PetProps {
  pet: Pet;
  userId: string;
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
    label: formatPetScale([key, v]),
    value: key,
  };
});

const PetBio: React.FC<PetProps> = ({ pet, userId }) => {
  const [editMode, setEditMode] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [thisPet, setPet] = useAtom(petEditAtomFamily(pet.id)); // Use the dynamic atom for each pet
  const [state, formAction] = useFormState(updatePetInfoAction, {
    fields: {},
    message: "",
  });
  const form = useForm<z.infer<typeof existingPetSchema>>({
    defaultValues: {
      age: thisPet?.age ?? 1,
      breed: thisPet?.breed ?? "",
      id: thisPet?.id,
      name: thisPet?.name ?? "",
      sex: thisPet?.sex,
      size: thisPet?.size,
      specialNeeds: thisPet?.specialNeeds ?? "",
      species: thisPet?.species ?? "dog",
      userId,
      ...(state?.fields ?? {}),
    },
    resolver: zodResolver(existingPetSchema),
  });
  const {
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    if (state.message === "success") {
      form.reset();
      setEditMode(false);
    }
  }, [form, state]);

  const toggleEditMode = () => {
    setEditMode((state) => !state);
  };

  const handleSubmit = form.handleSubmit(() => {
    //TODO: better error handling. add a location for ui.
    console.debug(`form errors = ${JSON.stringify(errors)}`);
    return new Promise<void>((resolve, reject) => {
      // TS making me sad
      if (!thisPet || !thisPet.id || !userId) {
        reject(`missing id or userId for pet update.`);
      } else {
        const f = new FormData(formRef.current!);
        f.append("id", thisPet.id!);
        f.append("userId", userId);
        formAction(f);
        resolve();
      }
    });
  });

  return (
    !!thisPet && (
      <div className="mb-4">
        <h3 className="text-lg font-bold">Pet Info</h3>
        {editMode ? (
          <>
            <Form {...form}>
              <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
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
                  <Button disabled={isSubmitting} type="submit">
                    {isSubmitting ? (
                      <ReloadIcon className="animate-spin" />
                    ) : (
                      "Save"
                    )}
                  </Button>
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
        <div className="flex gap-2 justify-end">
          {!editMode && (
            <>
              <Button
                onClick={async () => {
                  const response = await deletePet(thisPet.id);
                  console.debug(`delete response: ${JSON.stringify(response)}`);
                }}
              >
                Delete
              </Button>
              <Button onClick={toggleEditMode}>Edit</Button>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default PetBio;
