/* eslint-disable no-unused-vars */
"use client";

import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../../../lib/types";
import { Button } from "../../ui/button";
import { FormItem, FormLabel } from "../../ui/form";
import { Input } from "../../ui/input";

function TieredPricingFormFields({
  form,
  index,
  isEditMode,
}: {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  isEditMode: boolean;
}) {
  const [newTierKey, setNewTierKey] = useState("");
  const [newTierValue, setNewTierValue] = useState("");

  const addTierField = () => {
    if (!newTierKey.trim()) return;

    // const currentTiers =
    //   form.getValues(`services.${index}.pricingModel.tiers`) || {};
    //
    // form.setValue(`services.${index}.pricingModel.tiers`, {
    //   ...currentTiers,
    //   [newTierKey]: Number(newTierValue) || 0,
    // });

    // Reset inputs
    setNewTierKey("");
    setNewTierValue("");
  };

  // eslint-disable-next-line no-unused-vars
  const removeTierField = (fieldName: string) => {
    //   const currentValues = form.getValues(
    //     `services.${index}.pricingModel.tiers`,
    //   );
    //   const newValues = { ...currentValues };
    //   delete newValues[fieldName];
    //   form.setValue(`services.${index}.pricingModel.tiers`, newValues);
  };

  // const priceTiers = form.watch(
  //   `services.${index}.pricingModel.tiers`,
  // ) as Record<string, number>;

  return (
    <>
      {/* Existing Addons */}
      <div className="space-y-3">
        {Object.entries({}).map(([key]) => (
          <div key={key} className="flex gap-3">
            <div className="grid grid-cols-2 gap-3 flex-1">
              <FormItem>
                <FormLabel>Tier Name</FormLabel>
                <Input value={key} disabled className="bg-gray-50" />
              </FormItem>
              {/* <FormField */}
              {/*   control={form.control} */}
              {/*   name={`services.${index}.pricingModel.tiers.${key}`} */}
              {/*   render={({ field }) => ( */}
              {/*     <FormItem> */}
              {/*       <FormLabel>Price</FormLabel> */}
              {/*       <FormControl> */}
              {/*         <Input {...field} type="number" disabled={!isEditMode} /> */}
              {/*       </FormControl> */}
              {/*     </FormItem> */}
              {/*   )} */}
              {/* /> */}
            </div>
            {isEditMode && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="mt-8"
                onClick={() => removeTierField(key)}
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
                <FormLabel>New Tier Name</FormLabel>
                <Input
                  value={newTierKey}
                  onChange={(e) => setNewTierKey(e.target.value)}
                  placeholder="Enter add-on name"
                />
              </FormItem>
              <FormItem>
                <FormLabel>Price</FormLabel>
                <Input
                  value={newTierValue}
                  onChange={(e) => setNewTierValue(e.target.value)}
                  type="number"
                  placeholder="Enter price"
                />
              </FormItem>
            </div>
            <Button
              type="button"
              size="icon"
              className="mt-8"
              onClick={addTierField}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default TieredPricingFormFields;
