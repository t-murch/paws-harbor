import { baseServiceFormValues } from "@/../../api/src/types";
import { Button } from "@/components/ui/button";
import {
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
import { ServiceFormData } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import {
  isBaseRatePricing,
  isTieredPricing,
  ServicePricing,
} from "../../../../../api/src/types/pricing";
import BasePricingFormFields from "./BasePricingFormFields";
import DynamicServiceFields from "./ServiceFields";
import TieredPricingFormFields from "./TieredPricingFormFields";
import { log } from "@repo/logger";

interface ServiceFormItemProps {
  availableServices: any[];
  // availableServices: (typeof baseServiceFormValues)[];
  form: UseFormReturn<ServiceFormData>;
  index: number;
  field: any;
  isEditMode: boolean;
  remove: (index: number) => void;
}

const parseMe = (model: ServicePricing) => {
  if (isBaseRatePricing(model)) {
    return {
      additionalPrice: model.additionalPrice,
      additionalTime: model.additionalTime ?? 0,
      addons: model.addons,
      basePrice: model.basePrice,
      baseTime: model.baseTime ?? 0,
      timeUnit: model.timeUnit,
      type: model.type,
    };
  } else if (isTieredPricing(model)) {
    log(`isTiered!==${JSON.stringify(model, null, 2)}`);
    return {
      tierMapping: model.tierMapping ?? [],
      tiers: model.tiers ?? {},
      type: model.type,
    };
  }

  return model;
};

export default function ServiceFormItem({
  availableServices,
  form,
  index,
  field,
  isEditMode,
  remove,
}: ServiceFormItemProps) {
  const instanceOption = baseServiceFormValues.find(
    (s) => s.value === field.name,
  );
  const currentOptions = [
    // baseServiceFormValues.find((s) => s.value === field.name),
    ...availableServices,
  ];
  if (instanceOption) currentOptions.push(instanceOption);

  const pricingModelType = form.watch(`services.${index}.pricingModel.type`);
  let pricingModel = form.watch(`services.${index}.pricingModel`);

  // pricingModel = parseMe(pricingModel);
  // log(`pricingModel=${JSON.stringify(pricingModel, null, 2)}`);

  return (
    <div key={field.id} className="min-h-[350px] mb-4 p-4 border rounded">
      <FormField
        control={form.control}
        name={`services.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Select
              {...field}
              defaultValue={field.value}
              disabled={!isEditMode}
              onValueChange={field.onChange}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {currentOptions.map((service, idx) => (
                  <SelectItem key={idx} value={service.value}>
                    {service.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`services.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Input disabled={!isEditMode} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`services.${index}.pricingModel.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Model</FormLabel>
            <Select
              {...field}
              defaultValue={field.value}
              disabled={!isEditMode}
              onValueChange={(e) => {
                field.onChange(e);
                form.setValue(`services.${index}.pricingModel`, {
                  ...parseMe(pricingModel),
                });
              }}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pricing Model" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="baseRate">Base Rate</SelectItem>
                <SelectItem value="tiered">Tiered</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {pricingModelType === "baseRate" && (
        <BasePricingFormFields
          form={form}
          index={index}
          isEditMode={isEditMode}
        />
      )}

      {pricingModelType === "tiered" && (
        <TieredPricingFormFields
          form={form}
          index={index}
          isEditMode={isEditMode}
        />
      )}

      <br />

      {/* Add-ons are a Record<string, number> */}
      <DynamicServiceFields form={form} index={index} isEditMode={isEditMode} />

      {isEditMode && (
        <Button type="button" onClick={() => remove(index)} className="mt-2">
          Remove
        </Button>
      )}
    </div>
  );
}
