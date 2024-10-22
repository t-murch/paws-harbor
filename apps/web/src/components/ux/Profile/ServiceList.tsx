import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Service } from "@/lib/types";
import React from "react";

interface ServiceListProps {
  services: Service[];
}

const ServiceList: React.FC<ServiceListProps> = ({ services }) => {
  return (
    <div>
      <h3>Services</h3>
      {services.map((service) => (
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
