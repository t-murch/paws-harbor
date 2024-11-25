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

  const removeMetadataField = (fieldName: string) => {
    const currentValues = form.getValues(`services.${index}.metadata`);
    const newValues = { ...currentValues };
    delete newValues[fieldName];
    form.setValue(`services.${index}.metadata`, newValues);
  };
  // Get current values for rendering
  const metadata = form.watch(`services.${index}.metadata`) as Record<
    string,
    unknown
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
    </div>
  );
};

export default DynamicServiceFields;
