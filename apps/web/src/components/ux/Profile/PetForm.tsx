import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
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
import { forwardRef } from "react";

const PetForm = forwardRef((props, ref) => {
  return (
    <form ref={ref} action={formAction}>
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
        <Button variant={"secondary"} onClick={toggleEditMode} type="button">
          {"Cancel"}
        </Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
});
