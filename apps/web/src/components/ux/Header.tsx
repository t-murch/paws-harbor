import pawsIcon from "@/../public/paws-round.svg";
import { logoutAction } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Icon from "@/components/ux/Icon";
import Image from "next/image";
import Link from "next/link";
import ClientBtn from "./ClientBtn";

export function Header() {
  return (
    <header className="header h-24 mb-4 flex flex-row items-center justify-between">
      <div className="title flex flex-row gap-2">
        <Image alt="paws-logo" priority src={pawsIcon} />
        <h1 className="flex w-full items-center justify-center text-2xl font-extrabold">
          Paws on the Harbor
        </h1>
      </div>
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
              <Link href="/about">
                <h4>About</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/login">
                <h4>Login / Signup</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/account">
                <h4>My Account</h4>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href="/services">
                <h4>Our Services</h4>
              </Link>
            </SheetClose>
            {/* Should ALWAYS remain at the bottom of the list */}
            <SheetClose asChild>
              <ClientBtn action={logoutAction} label={"Log Out"}></ClientBtn>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
