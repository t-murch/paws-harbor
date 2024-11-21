import { BASE_SERVICES, baseServiceFormValues } from "@/../../api/src/types";
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
import { durationUnit } from "../../../../../api/src/db/services";
import DynamicServiceFields from "./ServiceFields";

interface ServiceFormItemProps {
  availableServices: any[];
  // availableServices: (typeof baseServiceFormValues)[];
  form: UseFormReturn<ServiceFormData>;
  index: number;
  field: any;
  isEditMode: boolean;
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
              onValueChange={field.onChange}
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

      {/* FormField representing the BaseRatePricing interface
       * will be refactored to solo component handling BaseRatePricing
       * and TieredPricing
       */}
      <div className="grid grid-rows-1 grid-cols-2 gap-2">
        <FormField
          control={form.control}
          name={`services.${index}.pricingModel.basePrice`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Base Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  disabled={!isEditMode}
                  // type="number"
                  // readOnly={!isEditMode}
                />
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
                <Input
                  {...field}
                  disabled={!isEditMode}
                  type="number"
                  // readOnly={!isEditMode}
                />
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
                <Input
                  {...field}
                  disabled={!isEditMode}
                  type="number"
                  // readOnly={!isEditMode}
                />
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
              <Input
                {...field}
                disabled={!isEditMode}
                type="number"
                // readOnly={!isEditMode}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

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
