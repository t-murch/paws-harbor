import { baseServiceFormValues } from "@repo/shared/server";
import { UseFormReturn } from "react-hook-form";
import { ServiceFormData } from "../../../lib/types";
import { Button } from "../../ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import BasePricingFormFields from "./BasePricingFormFields";
import DurationOptionsFormFields from "./DurationOptions";
import DynamicServiceFields from "./ServiceFields";

interface ServiceFormItemProps {
  availableServices: any[];
  form: UseFormReturn<ServiceFormData>;
  index: number;
  field: any;
  isEditMode: boolean;
  // I dont want to combine another config change with active work.
  // eslint-disable-next-line no-unused-vars
  remove: (index: number) => void;
}

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

  const pricingModelType = form.watch(`services.${index}.isTiered`);
  console.log(`pricingModelType: ${pricingModelType}`);
  let pricingModel = form.watch(`services.${index}.durationOptions`);
  // baseRate = form.watch(`services.${index}.baseRate`);

  return (
    <div className="min-h-[350px] mb-4 p-4 border rounded">
      <FormField
        control={form.control}
        name={`services.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <Select
              defaultValue={field.value}
              disabled={!isEditMode}
              name={field.name}
              onValueChange={field.onChange}
              value={field.value}
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
        name={`services.${index}.isTiered`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Model</FormLabel>
            <Select
              disabled={!isEditMode}
              onValueChange={(e) => {
                const boolVal = e === "true";
                field.onChange(boolVal);

                if (boolVal) {
                  form.setValue(
                    `services.${index}.durationOptions`,
                    pricingModel,
                  );
                }
                // else {
                //   form.setValue(`services.${index}.baseRate`, baseRate ?? 0);
                // }
              }}
              {...field}
              value={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pricing Model" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="false">Base Rate</SelectItem>
                <SelectItem value="true">Tiered</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {!pricingModelType && (
        <BasePricingFormFields
          form={form}
          index={index}
          isEditMode={isEditMode}
        />
      )}

      {pricingModelType && (
        <DurationOptionsFormFields
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
