"use client";

import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Label } from "@radix-ui/react-label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { mergeClassNames as cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { petSizeDropDownRecords } from "./Pet";
export type PetComboBoxProps = {
  // eslint-disable-next-line no-unused-vars
  setFormFunc: (name: keyof FormData, value: string) => void;
  name: keyof FormData;
};

export function PetSizeCombobox({ name, setFormFunc }: PetComboBoxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <>
      <Label htmlFor="size">Size</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between mb-4"
          >
            {value
              ? petSizeDropDownRecords.find((size) => size.value === value)
                  ?.value
              : "Select size..."}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            {/* <CommandInput placeholder="Search framework..." className="h-9" /> */}
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {petSizeDropDownRecords.map((size) => (
                  <CommandItem
                    key={size.value}
                    value={size.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setFormFunc(
                        name,
                        currentValue === value ? "" : currentValue,
                      );
                      setOpen(false);
                    }}
                  >
                    {size.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === size.value ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
