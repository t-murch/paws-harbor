"use client";

import { Button } from "../../ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../../../lib/types";
import { FormControl, FormField, FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

function DurationOptionsFormFields({
  form,
  index,
  isEditMode,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  isEditMode: boolean;
}) {
  const currentOptions =
    form.getValues(`services.${index}.durationOptions`) || [];
  const [newDurationUnit, setNewDurationUnit] = useState("");
  const [newDurationValue, setNewDurationValue] = useState("");
  const [newTieredRate, setNewTieredRate] = useState(currentOptions.length + 1);
  const [newTierLevel, setNewTierLevel] = useState("");

  const addDurationOption = () => {
    if (!newDurationUnit.trim() || !newDurationValue.trim()) return;

    form.setValue(`services.${index}.durationOptions`, [
      ...currentOptions,
      {
        durationUnit: newDurationUnit,
        durationValue: Number(newDurationValue),
        serviceId: form.getValues(`services.${index}.id`) || "",
        tierLevel: Number(newTierLevel),
        tieredRate: String(newTieredRate),
      },
    ]);

    // Reset inputs
    setNewDurationUnit("");
    setNewDurationValue("");
    setNewTieredRate(currentOptions.length + 1);
    setNewTierLevel("");
  };

  const removeDurationOption = (optionIndex: number) => {
    const currentOptions = form.getValues(`services.${index}.durationOptions`);
    const newOptions = currentOptions.filter((_, idx) => idx !== optionIndex);
    form.setValue(`services.${index}.durationOptions`, newOptions);
  };

  const durationOptions = form.watch(`services.${index}.durationOptions`);

  return (
    <>
      {/* Existing Duration Options */}
      <div className="space-y-3">
        {durationOptions.map((_, optionIndex) => (
          <div key={optionIndex} className="flex gap-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              <FormField
                control={form.control}
                name={`services.${index}.durationOptions.${optionIndex}.durationValue`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Value</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" disabled={!isEditMode} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`services.${index}.durationOptions.${optionIndex}.durationUnit`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration Unit</FormLabel>
                    <FormControl>
                      <Select
                        disabled={!isEditMode}
                        onValueChange={field.onChange}
                        {...field}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minutes">Minutes</SelectItem>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name={`services.${index}.durationOptions.${optionIndex}.tieredRate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rate</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" disabled={!isEditMode} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`services.${index}.durationOptions.${optionIndex}.tierLevel`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tier Level</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        disabled={!isEditMode}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-8 self-end"
                onClick={() => removeDurationOption(optionIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Duration Option */}
      {isEditMode && (
        <div className="mt-4 space-y-3">
          <div className="flex gap-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
              <FormItem>
                <FormLabel>Duration Value</FormLabel>
                <Input
                  value={newDurationValue}
                  onChange={(e) => setNewDurationValue(e.target.value)}
                  type="number"
                  placeholder="Enter value"
                />
              </FormItem>
              <FormItem>
                <FormLabel>Duration Unit</FormLabel>
                <Select
                  value={newDurationUnit}
                  onValueChange={setNewDurationUnit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minutes">Minutes</SelectItem>
                    <SelectItem value="hours">Hours</SelectItem>
                    <SelectItem value="days">Days</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>

              <FormItem>
                <FormLabel>Rate</FormLabel>
                <Input
                  value={newTieredRate}
                  onChange={(e) => setNewTieredRate(+e.target.value)}
                  type="text"
                  placeholder="Enter rate"
                />
              </FormItem>
              <FormItem>
                <FormLabel>Tier Level</FormLabel>
                <Input
                  value={newTierLevel}
                  onChange={(e) => setNewTierLevel(e.target.value)}
                  type="number"
                  placeholder="Enter level"
                />
              </FormItem>
            </div>
            <Button
              type="button"
              size="icon"
              className="mt-8 self-end"
              onClick={addDurationOption}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default DurationOptionsFormFields;
