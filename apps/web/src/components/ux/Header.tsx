"use server";

// import pawsIcon from "@/../public/paws-round.svg";
import Image from "next/image";
import Link from "next/link";
import pawsIcon from "../../../public/paws-round.svg";
import { getUserProfile } from "../../app/account/actions";
import { logoutAction } from "../../app/login/actions";
import { supabaseServerClient } from "../../lib/supabase/server";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import ClientBtn from "./ClientBtn";
import Icon from "./Icon";

export async function Header() {
  //TODO: THIS USER CHECK NEEDS TO BE UPDATED TO RBAC,
  const {
    data: { user },
  } = await supabaseServerClient.auth.getUser();
  const adminInfo = await getUserProfile();
  return (
    <header className="header h-24 mb-4 flex flex-row items-center justify-between">
      <Link href="/" className="title flex flex-row gap-2">
        <Image alt="paws-logo" priority src={pawsIcon} />
        <h1 className="flex w-full items-center justify-center text-2xl font-extrabold">
          Paws on the Harbor
        </h1>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="default" className="h-12 w-12">
            <Icon name="menu" size={24} />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetTitle />
          <SheetDescription />
          <div className="flex flex-col items-center gap-6 px-6">
            <SheetClose asChild>
              <Link href="/">
                <h4>Home</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/login">
                <h4>Login / Signup</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/services">
                <h4>Our Services</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/booking">
                <h4>Schedule Services</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/account">
                <h4>My Account</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/about">
                <h4>About</h4>
              </Link>
            </SheetClose>
            {adminInfo?.user?.admin && (
              <SheetClose asChild>
                <Link href="/admin">
                  <h4>Admin</h4>
                </Link>
              </SheetClose>
            )}
            {user && (
              <SheetClose asChild>
                <ClientBtn action={logoutAction} label={"Log Out"}></ClientBtn>
              </SheetClose>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
