import Link from "next/link";
import { ReactElement } from "react";
import NavLink from "~/components/ui/NavLink";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 box-border flex h-12 w-full flex-row justify-between  p-4">
      <div className="flex h-fit min-h-fit w-full flex-row items-center justify-between px-4 py-2 ">
        <div>
          <Link
            href={"/"}
            className="font-velvendachill text-3xl font-normal text-secondary"
          >
            TREASURIO
          </Link>
        </div>
        <div className="flex h-8 flex-row items-center justify-between rounded-3xl shadow-md outline outline-1 outline-secondary">
          <NavbarProjectButton title="Carte" route="/pistes/1/carte" />
          <NavbarProjectButton title="Partage" route="/pistes/1/partage" />
          <NavbarProjectButton
            title="Suivi"
            route="/pistes/1/suivi/classement"
          />
        </div>
        <div className="flex h-8 flex-row space-x-4">
          <NavbarButton title="Vos pistes" route="/pistes" />
          <SignedIn>
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}

const NavbarButton = function (props: {
  title: string;
  route: string;
}): ReactElement {
  return (
    <NavLink
      href={`${props.route}`}
      activeClassName="outline-primary outline outline-1"
      className="text-md flex h-full items-center justify-center rounded-full px-4 text-primary"
    >
      {props.title}
    </NavLink>
  );
};

const NavbarProjectButton = function (props: {
  title: string;
  route: string;
}): ReactElement {
  return (
    <NavLink
      href={`${props.route}`}
      activeClassName="bg-secondary text-secondary-foreground"
      nonActiveClassName="hover:bg-orange-100"
      className="text-md flex h-full items-center justify-center rounded-full px-12 font-bold text-secondary"
    >
      {props.title}
    </NavLink>
  );
};
