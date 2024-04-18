import Link from "next/link";
import { ReactElement } from "react";
import NavLink from "~/components/ui/NavLink";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { InProjectNavLinks } from "./navbarClienside";

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
        <InProjectNavLinks />
        <div className="flex h-8 flex-row space-x-4">
          <SignedIn>
            <NavbarButton title="Vos pistes" route="/pistes" />
            <UserButton />
          </SignedIn>

          <SignedOut>
            <SignInButton redirectUrl="/pistes">
              <div className="flex flex-col justify-center">
                <h3 className="h-fit text-primary">Connection</h3>
              </div>
            </SignInButton>
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
      nonActiveClassName="outline-primary outline outline-1 text-primary"
      activeClassName="bg-primary text-primary-foreground"
      className="text-md flex h-full items-center justify-center rounded-full px-4 font-bold"
    >
      {props.title}
    </NavLink>
  );
};

export const NavbarProjectButton = function (props: {
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
