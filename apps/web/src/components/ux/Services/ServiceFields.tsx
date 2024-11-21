import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ServiceFormData } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";

interface DynamicFieldsProps {
  form: UseFormReturn<ServiceFormData>;
  index: number;
  isEditMode: boolean;
}

const DynamicServiceFields = ({
  form,
  index,
  isEditMode,
}: DynamicFieldsProps) => {
  // Track temporary state for new field inputs
  const [newMetadataKey, setNewMetadataKey] = React.useState("");
  const [newMetadataValue, setNewMetadataValue] = React.useState("");
  const [newAddonKey, setNewAddonKey] = React.useState("");
  const [newAddonValue, setNewAddonValue] = React.useState("");

  const addMetadataField = () => {
    if (!newMetadataKey.trim()) return;

    const currentMetadata = form.getValues(`services.${index}.metadata`) || {};
    form.setValue(`services.${index}.metadata`, {
      ...currentMetadata,
      [newMetadataKey]: newMetadataValue,
    });

    // Reset inputs
    setNewMetadataKey("");
    setNewMetadataValue("");
  };

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

  const removeMetadataField = (fieldName: string) => {
    const currentValues = form.getValues(`services.${index}.metadata`);
    const newValues = { ...currentValues };
    delete newValues[fieldName];
    form.setValue(`services.${index}.metadata`, newValues);
  };

  const removeAddonField = (fieldName: string) => {
    const currentValues = form.getValues(
      `services.${index}.pricingModel.addons`,
    );
    const newValues = { ...currentValues };
    delete newValues[fieldName];
    form.setValue(`services.${index}.pricingModel.addons`, newValues);
  };

  // Get current values for rendering
  const metadata = form.watch(`services.${index}.metadata`) as Record<
    string,
    unknown
  >;
  const addons = form.watch(`services.${index}.pricingModel.addons`) as Record<
    string,
    number
  >;

  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-4">
        <h3 className="text-lg font-medium mb-4">Metadata Fields</h3>

        {/* Existing Metadata Fields */}
        <div className="space-y-3">
          {Object.entries(metadata || {}).map(([key, value]) => (
            <div key={key} className="flex gap-3">
              <FormField
                control={form.control}
                name={`services.${index}.metadata.${key}`}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-3 flex-1">
                    <FormItem>
                      <FormLabel>Key</FormLabel>
                      <Input value={key} disabled className="bg-gray-50" />
                    </FormItem>
                    <FormItem>
                      <FormLabel>Value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={!isEditMode}
                          value={String(field.value)}
                        />
                      </FormControl>
                    </FormItem>
                  </div>
                )}
              />
              {isEditMode && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="mt-8"
                  onClick={() => removeMetadataField(key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* Add New Metadata Field */}
        {isEditMode && (
          <div className="mt-4 space-y-3">
            <div className="flex gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <FormItem>
                  <FormLabel>New Key</FormLabel>
                  <Input
                    value={newMetadataKey}
                    onChange={(e) => setNewMetadataKey(e.target.value)}
                    placeholder="Enter key"
                  />
                </FormItem>
                <FormItem>
                  <FormLabel>New Value</FormLabel>
                  <Input
                    value={newMetadataValue}
                    onChange={(e) => setNewMetadataValue(e.target.value)}
                    placeholder="Enter value"
                  />
                </FormItem>
              </div>
              <Button
                type="button"
                size="icon"
                className="mt-8"
                onClick={addMetadataField}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

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
    </div>
  );
};

export default DynamicServiceFields;
