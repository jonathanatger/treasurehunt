"use client";

import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import NavLink from "./ui/NavLink";
import { ReactElement, SetStateAction, useState } from "react";
import { cn } from "~/lib/utils";

export function NavbarAdditionalLinks() {
  const [menuIsVisible, setMenuIsVisible] = useState(false);

  const isScreenMediumWidth =
    typeof window !== "undefined"
      ? window.screen.width > 782
        ? true
        : false
      : true;

  return (
    <div
      className={cn(
        "pointer-events-none right-0 top-0 flex",
        menuIsVisible
          ? "space-y-2 bg-background shadow-lg outline outline-1 outline-primary"
          : "bg-transparent",
        isScreenMediumWidth
          ? "absolute h-full w-full flex-row items-center justify-end rounded-3xl p-4"
          : " fixed w-[100vw] flex-col items-center justify-center space-y-4 p-2 text-2xl",
      )}
    >
      <MenuVisibilityButton
        className={cn(
          "pointer-events-auto  self-end rounded-full text-primary hover:scale-110 ",
          isScreenMediumWidth ? "hidden" : "",
        )}
        onClick={() => setMenuIsVisible(!menuIsVisible)}
      />
      {((menuIsVisible && !isScreenMediumWidth) || isScreenMediumWidth) && (
        <ResponsiveNavbarLinks
          isMediumWidth={isScreenMediumWidth}
          setMenuIsVisible={setMenuIsVisible}
        />
      )}
    </div>
  );
}

export function ResponsiveNavbarLinks({
  isMediumWidth: isScreenMediumWidth,
  setMenuIsVisible,
}: {
  isMediumWidth: boolean;
  setMenuIsVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div
      className={cn(
        "pointer-events-none flex h-full w-full",
        isScreenMediumWidth ? "flex-row justify-end" : "flex-col space-y-4",
      )}
    >
      <InProjectNavLinks
        className={cn(
          "pointer-events-auto flex w-fit items-center shadow-md outline outline-1 outline-secondary",
          isScreenMediumWidth
            ? "absolute left-0 right-0 ml-auto mr-auto h-8 flex-row rounded-3xl"
            : "w-full flex-col rounded-2xl",
        )}
        setIsMenuVisible={setMenuIsVisible}
      />
      <div
        className={cn(
          "pointer-events-auto flex w-fit items-center",
          isScreenMediumWidth
            ? "h-full flex-row space-x-2"
            : "w-full flex-col space-y-4",
        )}
        onClick={() => {
          setMenuIsVisible(false);
        }}
      >
        <SignedIn>
          <NavbarButton
            className="w-full md:w-24"
            title="Vos pistes"
            route="/pistes"
          />
          <UserButton />
        </SignedIn>

        <SignedOut>
          <SignInButton afterSignInUrl="https://treasurehunt-jet.vercel.app/pistes">
            <div className="flex flex-col justify-center">
              <h3 className="h-fit w-full cursor-pointer text-primary hover:text-primary/80">
                Connection
              </h3>
            </div>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
}

export function MenuVisibilityButton({
  className,
  onClick,
}: {
  className: string;
  onClick: () => void;
}) {
  return <Menu onClick={onClick} size={40} className={className} />;
}

export function UserRelatedNavbarButtons({
  className,
  setIsMenuVisible,
}: {
  className: string;
  setIsMenuVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  return <div className={className}></div>;
}

export function InProjectNavLinks({
  className,
  setIsMenuVisible,
}: {
  className: string;
  setIsMenuVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const path = usePathname();
  const regex = /\/pistes\/\d+\//;
  const linksAreShown = regex.test(path);

  const result = regex.exec(path);
  let idOfProject = 1;
  if (result) {
    const subpath = result[0];
    const numberRegex = /\d+/;
    const matchingArray = numberRegex.exec(subpath);
    idOfProject = Number(matchingArray ? matchingArray[0] : "1");
  }

  if (linksAreShown) {
    return (
      <div
        className={className}
        onClick={() => {
          setIsMenuVisible(false);
        }}
      >
        <NavbarProjectButton
          title="Objectifs"
          route={`/pistes/${idOfProject}/objectifs`}
        />
        <NavbarProjectButton
          title="Partage"
          route={`/pistes/${idOfProject}/partage`}
        />
        <NavbarProjectButton
          title="Suivi"
          route={`/pistes/${idOfProject}/suivi/classement`}
          alternateRoute={`/pistes/${idOfProject}/suivi/carte`}
        />
      </div>
    );
  } else {
    return <></>;
  }
}

const NavbarButton = function (props: {
  title: string;
  route: string;
  alternateRoute?: string;
  className?: string;
}): ReactElement {
  return (
    <NavLink
      href={`${props.route}`}
      nonActiveClassName="outline-primary outline outline-1 text-primary"
      activeClassName="bg-primary text-primary-foreground"
      className={cn(
        "text-md flex h-full items-center justify-center truncate rounded-full px-4 font-bold",
        props.className,
      )}
    >
      {props.title}
    </NavLink>
  );
};

export const NavbarProjectButton = function (props: {
  title: string;
  route: string;
  alternateRoute?: string;
}): ReactElement {
  return (
    <NavLink
      href={`${props.route}`}
      activeClassName="bg-secondary text-secondary-foreground"
      nonActiveClassName="hover:bg-orange-100"
      className="text-md flex h-full w-full items-center justify-center rounded-2xl px-12 font-bold text-secondary"
      alternativeActivePath={props.alternateRoute}
    >
      {props.title}
    </NavLink>
  );
};
