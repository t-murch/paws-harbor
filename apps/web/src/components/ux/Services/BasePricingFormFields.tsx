"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { durationUnit } from "../../../../../api/src/db/services";
import { ServiceFormData } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function BasePricingFormFields({
  form,
  index,
  isEditMode,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  isEditMode: boolean;
}) {
  const [newAddonKey, setNewAddonKey] = useState("");
  const [newAddonValue, setNewAddonValue] = useState("");

  const addAddonField = () => {
    if (!newAddonKey.trim()) return;

    const currentAddons =
      form.getValues(`services.${index}.pricingModel.addons`) || {};

    form.setValue(`services.${index}.pricingModel.addons`, {
      ...currentAddons,
      [newAddonKey]: Number(newAddonValue) || 0,
    });

    // Reset inputs
    setNewAddonKey("");
    setNewAddonValue("");
  };

  const removeAddonField = (fieldName: string) => {
    const currentValues = form.getValues(
      `services.${index}.pricingModel.addons`,
    );
    const newValues = { ...currentValues };
    delete newValues[fieldName];
    form.setValue(`services.${index}.pricingModel.addons`, newValues);
  };

  const addons = form.watch(`services.${index}.pricingModel.addons`) as Record<
    string,
    number
  >;

  {
    /* FormField representing the BaseRatePricing interface
     * will be refactored to solo component handling BaseRatePricing
     * and TieredPricing
     */
  }
  return (
    <>
      <div className="grid grid-rows-1 grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`services.${index}.pricingModel.basePrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEditMode} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={`services.${index}.pricingModel.additionalPrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Price</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEditMode} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div className="grid grid-rows-1 grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`services.${index}.pricingModel.baseTime`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Time</FormLabel>
              <FormControl>
                <Input {...field} disabled={!isEditMode} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={`services.${index}.pricingModel.timeUnit`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit</FormLabel>
              <Select
                defaultValue={field.value}
                disabled={!isEditMode}
                onValueChange={field.onChange}
                {...field}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="hours / days" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {durationUnit.map((u, idx) => (
                    <SelectItem key={idx} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name={`services.${index}.pricingModel.additionalTime`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Time</FormLabel>
            <FormControl>
              <Input {...field} disabled={!isEditMode} type="number" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <br />

      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Add-ons</h3>

        {/* Existing Addons */}
        <div className="space-y-3">
          {Object.entries(addons || {}).map(([key, value]) => (
            <div key={key} className="flex gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <FormItem>
                  <FormLabel>Add-on Name</FormLabel>
                  <Input value={key} disabled className="bg-gray-50" />
                </FormItem>
                <FormField
                  control={form.control}
                  name={`services.${index}.pricingModel.addons.${key}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          disabled={!isEditMode}
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
                  className="mt-8"
                  onClick={() => removeAddonField(key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Addon */}
        {isEditMode && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <FormItem>
                  <FormLabel>New Add-on Name</FormLabel>
                  <Input
                    value={newAddonKey}
                    onChange={(e) => setNewAddonKey(e.target.value)}
                    placeholder="Enter add-on name"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <Input
                    value={newAddonValue}
                    onChange={(e) => setNewAddonValue(e.target.value)}
                    type="number"
                    placeholder="Enter price"
                  />
                </FormItem>
              </div>
              <Button
                type="button"
                size="icon"
                className="mt-8"
                onClick={addAddonField}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BasePricingFormFields;
