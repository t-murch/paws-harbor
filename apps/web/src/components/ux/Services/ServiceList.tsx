"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { ServiceFormData, serviceListSchema } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { createServiceAction } from "@/app/admin/actions";
import ServiceFormItem from "./ServiceFormItem";
import { log } from "@repo/logger";
import { baseServiceFormValues } from "@repo/shared/src/server";

interface ServiceListProps {
  initialServices: ServiceFormData;
}

const ServiceList: React.FC<ServiceListProps> = ({ initialServices }) => {
  const [, formAction] = useFormState(createServiceAction, {
    formFields: {},
    message: "",
  });
  // const { updatePrice } = usePricing();
  const [isEditMode, setIsEditMode] = useState(false);
  // log(`initialServices=${JSON.stringify(initialServices, null, 2)}`);

  const form = useForm<ServiceFormData>({
    // defaultValues: { services: { ...initialServices, ...state.fields } },
    defaultValues: { services: initialServices.services },
    resolver: zodResolver(serviceListSchema),
  });
  const {
    control,
    formState: { errors },
  } = form;
  const formRef = useRef<HTMLFormElement>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: "_id",
    name: "services",
  });

  const availableServices = baseServiceFormValues.filter(
    (s) => !fields.map((f) => f.name).includes(s.value),
  );

  const handleSubmit = form.handleSubmit(() => {
    console.log(`handleSubmit`);
    const formData = new FormData(formRef.current!);
    const serviceTypes = Object.fromEntries(formData);
    const formServiceNames: [string, string][] = [];
    for (const p in serviceTypes) {
      if (p.endsWith("name"))
        formServiceNames.push([p, String(serviceTypes[p])]);
    }
    // log(`formServiceNames=${JSON.stringify(formServiceNames, null, 2)}`);

    const existingFields = fields
      .filter((f) => {
        return (f.createdAt && f.updatedAt && f.id) !== undefined;
      })
      .map((f) => {
        //hydrate formData with existing fields
        return {
          createdAt: f.createdAt,
          id: f.id,
          name: f.name,
          updatedAt: f.updatedAt,
        };
      });

    existingFields.forEach((f) => {
      const some = formServiceNames.find(
        ([k, v]) => k.endsWith("name") && v === f.name,
      );
      if (some) {
        const prefix = some[0].replace("name", "").trim();
        log(`prefix=${prefix}`);
        formData.append(`${prefix}createdAt`, String(f.createdAt));
        formData.append(`${prefix}updatedAt`, String(f.updatedAt));
        formData.append(`${prefix}id`, String(f.id));
      }
    });

    const data = Object.fromEntries(formData);
    log(`data=${JSON.stringify(data, null, 2)}`);
    // log(`existingFields=${JSON.stringify(existingFields, null, 2)}`);

    return new Promise<void>((resolve) => {
      formAction(formData);
      setIsEditMode(false);
      resolve();
    });
  });

  function handleEditToggle() {
    console.log(`toggle clicked editmode=${isEditMode}`);
    return setIsEditMode((prev) => !prev);
  }

  if (errors?.services && errors.services.length) {
    console.log(`errors=${JSON.stringify(errors, null, 2)}`);
  }
  // console.log(`fields=${JSON.stringify(fields, null, 2)}`);
  // console.log(`message=${JSON.stringify(state, null, 2)}`);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-center">
          <span>Services</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form action={formAction} onSubmit={handleSubmit} ref={formRef}>
            {fields.length > 0 &&
              fields.map((field, index) => (
                <ServiceFormItem
                  availableServices={availableServices}
                  key={field.id}
                  form={form}
                  index={index}
                  field={field}
                  isEditMode={isEditMode}
                  remove={remove}
                />
              ))}

            <div
              className={`flex ${isEditMode ? "justify-between" : "justify-end"}`}
            >
              {isEditMode && availableServices.length > 0 && (
                <Button
                  type="button"
                  onClick={() =>
                    append({
                      description: "",
                      metadata: {},
                      name: availableServices[0].value,
                      pricingModel: {
                        additionalPrice: 0,
                        additionalTime: 0,
                        addons: {},
                        basePrice: 0,
                        baseTime: 0,
                        timeUnit: "hours",
                        type: "baseRate",
                      },
                    })
                  }
                >
                  Add
                </Button>
              )}
              <div className="flex gap-2">
                {isEditMode && <Button type="submit">Save</Button>}
                <Button onClick={handleEditToggle} type="button">
                  {/* This should also reset the form state as well. */}
                  {isEditMode ? "Cancel" : "Edit"}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ServiceList;
