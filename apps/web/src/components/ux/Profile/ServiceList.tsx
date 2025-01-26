/* eslint-disable no-unused-vars */
"use client";

import { Service } from "@repo/shared/db/schemas/schema";
import React, { useState } from "react";
import { Label } from "../../ui/label";

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
