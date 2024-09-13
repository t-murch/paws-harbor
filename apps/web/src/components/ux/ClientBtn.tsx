"use client";

import { ReactNode } from "react";
import { Button } from "../ui/button";

type ClientBtnProps = {
  action: () => Promise<void>;
  label: string;
  children?: ReactNode;
};

function ClientBtn({ action, label, children }: ClientBtnProps) {
  return (
    <Button
      variant="ghost"
      onClick={async () => {
        if (action) await action();
      }}
    >
      <h4>{label}</h4>
      {children}
    </Button>
  );
}

export default ClientBtn;
