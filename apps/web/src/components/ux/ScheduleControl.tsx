"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import React from "react";

export type ControlBarProps = {
  filters: DropdownItem[];
  // eslint-disable-next-line no-unused-vars
  onServiceTypeChange: (services: DropdownItem[]) => void;
};

export type DropdownItem = {
  id: number;
  name: string;
};

const ControlBar = ({ filters, onServiceTypeChange }: ControlBarProps) => {
  const [selectedServices, setSelectedServices] = React.useState<
    DropdownItem[]
  >([filters[0]]);
  const [open, setOpen] = React.useState(false);

  // Toggle service selection
  const toggleService = (service: DropdownItem) => {
    let newServices;
    if (selectedServices.find((s) => s.id === service.id)) {
      newServices = selectedServices.filter((s) => s.id !== service.id);
    } else {
      newServices = [...selectedServices, service];
    }
    setSelectedServices(newServices);
    onServiceTypeChange(newServices);
  };

  return (
    <Card className="mx-2 md:mx-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Left side - Title */}
          <h2 className="text-lg font-semibold">Booking Filters</h2>

          {/* Right side - Filters */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="justify-between"
                    >
                      Service Types
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <Command>
                      <CommandInput placeholder="Search services..." />
                      <CommandList>
                        <CommandEmpty>No service found.</CommandEmpty>
                        <CommandGroup>
                          {filters.map((service) => (
                            <CommandItem
                              key={service.id}
                              onSelect={() => toggleService(service)}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  selectedServices.some(
                                    (s) => s.id === service.id,
                                  )
                                    ? "opacity-100"
                                    : "opacity-0"
                                }`}
                              />
                              {service.name
                                .split("-")
                                .map(
                                  (val) =>
                                    val.charAt(0).toUpperCase() +
                                    val.slice(1) +
                                    " ",
                                )
                                .join(" ")}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlBar;
