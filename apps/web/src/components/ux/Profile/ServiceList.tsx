/* eslint-disable no-unused-vars */
"use client";

import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { Service } from "@repo/shared/src/db/schemas/services";

interface ServiceListProps {
  services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const [state, setServices] = useState<Service[]>(services);
  const [newService, setNewService] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <h3>Services</h3>
      {state.map((service) => (
        <div key={service.id}>
          <Label>Type</Label>
          {/* <Input value={service.type} readOnly /> */}

          <Label>Frequency</Label>
          {/* <Input value={service.frequency} readOnly /> */}

          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
