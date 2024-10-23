"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { usePricing } from "../providers/store";
import {
  ServiceFormData,
  serviceListSchema,
  ServiceSchemaClient,
} from "@/lib/types";
import { SelectService } from "../../../../../api/src/db/services";

interface ServiceListProps {
  initialServices: ServiceFormData;
  onSave?: (services: ServiceFormData["services"]) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ initialServices }) => {
  const [, formAction] = useFormState(
    (prev, formData) => ({ fields: {}, message: "" }),
    { fields: {}, message: "" },
  );
  const { updatePrice } = usePricing();
  const [isEditMode, setIsEditMode] = useState(false);

  const form = useForm<ServiceFormData>({
    // defaultValues: { services: { ...initialServices, ...state.fields } },
    defaultValues: { services: initialServices.services },
    resolver: zodResolver(serviceListSchema),
  });
  const { control } = form;
  const formRef = useRef<HTMLFormElement>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  // useEffect(() => {
  //   // Update pricing atoms when services change
  //   watchServices.forEach((service) => {
  //     if (service.type && service.price) {
  //       updatePrice(service.type, service.price);
  //     }
  //   });
  // }, [watchServices, updatePrice]);

  const handleSubmit = form.handleSubmit(() => {
    return new Promise<void>((resolve) => {
      // const formData = new FormData(formRef.current!);
      // formAction(formData);
      // onSave(formData);
      setIsEditMode(false);
      resolve();
    });
  });
  const onSubmit = (data: ServiceFormData) => {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Services</span>
          <Button onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? "Cancel" : "Edit"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} onSubmit={handleSubmit} ref={formRef}>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-4 p-4 border rounded">
                <FormField
                  control={form.control}
                  name={`services.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input readOnly={!isEditMode} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`services.${index}.frequency`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select
                        defaultValue={field.value}
                        disabled={!isEditMode}
                        onValueChange={field.onChange}
                        // value={watchServices[index]?.frequency}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`services.${index}.price`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <Input {...field} type="number" readOnly={!isEditMode} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`services.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <Input {...field} readOnly={!isEditMode} />
                    </FormItem>
                  )}
                />

                {isEditMode && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}

            {/* {isEditMode && ( */}
            {/*   <> */}
            {/*     <Button */}
            {/*       type="button" */}
            {/*       onClick={() => */}
            {/*         append({ */}
            {/*           description: "", */}
            {/*           frequency: "daily", */}
            {/*           price: 0, */}
            {/*           type: "pet-walking", */}
            {/*         }) */}
            {/*       } */}
            {/*     > */}
            {/*       Add Service */}
            {/*     </Button> */}
            {/*     <Button type="submit" className="ml-2"> */}
            {/*       Save */}
            {/*     </Button> */}
            {/*   </> */}
            {/* )} */}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
