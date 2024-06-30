"use client";

import placeholderImage from "@/../public/paws-placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ux/Icon";
import { MySection } from "@/components/ux/MySection";
import Image from "next/image";
import { useState } from "react";

const API_HOST = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function Web() {
  const [name, setName] = useState<string>("");
  const [response, setResponse] = useState<{ message: string } | null>(null);
  const [error, setError] = useState<string | undefined>();

  return (
    <div className="home h-auto w-full">
      <main className="container h-full w-full mx-auto px-5 py-2 grid grid-rows-20 gap-2 items-center">
        <section className="flex title row-span-3">
          <h1 className="flex w-full items-center justify-center text-2xl font-extrabold">
            Paws on the Harbor
          </h1>
        </section>
        <section className="content flex row-span-7">
          <div className="flex h-full w-full items-center justify-center">
            <Image alt="placeholder-image" src={placeholderImage} />
          </div>
        </section>
        <section className="h-full login row-span-6">
          <div className="h-full w-full py-6 grid gap-2 grid-rows-2 grid-cols-1 items-center">
            <Button className="h-16 rounded-full self-end" variant="default">
              Login
            </Button>
            <Button className="h-16 rounded-full self-start" variant="default">
              Register
            </Button>
          </div>
        </section>
        <section className="footer row-span-4">
          <div className="flex h-full w-full gap-2 items-center justify-center">
            <Icon name="instagram" size={36} />
          </div>
        </section>
      </main>
    </div>
  );
}
