"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useCallback, useState } from "react";
import { SelectService } from "../../../../../api/src/db/services";
import { BASE_SERVICES, BaseService } from "../../../../../api/src/types";

// Base services that are always available

interface ServiceListProps {
  services: SelectService[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  const [state, setServices] = useState<SelectService[]>(services);
  const [newService, setNewService] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <h3>Services</h3>
      {state.map((service) => (
        <div key={service.id}>
          <Label>Type</Label>
          <Input value={service.type} readOnly />

          <Label>Frequency</Label>
          <Input value={service.frequency} readOnly />

          {/* Add more fields as needed */}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
