"use client";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import NavLink from "./ui/NavLink";
import { ReactElement, SetStateAction, useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Session } from "next-auth";
import { signOutAction } from "./actions";
import Link from "next/link";

export function NavbarAdditionalLinks({
  user,
  isUserSignedIn,
}: {
  user: Session | null;
  isUserSignedIn: boolean;
}) {
  const [menuIsVisible, setMenuIsVisible] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.screen.width > 782) {
      setMenuIsVisible(true);
    }
  }, []);

  return (
    <div
      className={cn(
        "pointer-events-none right-0 top-0 flex",
        "fixed w-[100vw] flex-col items-center justify-center space-y-4  p-2 text-2xl",
        menuIsVisible
          ? "space-y-2 bg-background shadow-lg outline outline-1 outline-primary"
          : "bg-transparent",
        "md:absolute md:h-full md:w-full md:flex-row md:items-center md:justify-end md:space-y-0 md:bg-transparent md:p-4 md:text-base md:shadow-none md:outline-none",
      )}
    >
      <MenuVisibilityButton
        className={cn(
          "pointer-events-auto self-end rounded-full text-primary hover:scale-110 ",
          "md:hidden",
        )}
        onClick={() => setMenuIsVisible(!menuIsVisible)}
      />
      <ResponsiveNavbarLinks
        className={cn(
          "pointer-events-none flex h-fit w-full",
          "flex-col space-y-4",
          "md:w-auto md:flex-row md:items-center md:justify-end md:space-y-0",
          menuIsVisible ? "" : "hidden",
        )}
        menuIsVisible={menuIsVisible}
        setMenuIsVisible={setMenuIsVisible}
        user={user}
        isUserSignedIn={isUserSignedIn}
      />
    </div>
  );
}

export function ResponsiveNavbarLinks({
  menuIsVisible,
  setMenuIsVisible,
  user,
  isUserSignedIn,
  className,
}: {
  menuIsVisible: boolean;
  setMenuIsVisible: React.Dispatch<SetStateAction<boolean>>;
  user: Session | null;
  isUserSignedIn: boolean;
  className: string;
}) {
  return (
    <div className={className}>
      <InProjectNavLinks
        className={cn(
          "pointer-events-auto flex items-center shadow-md outline outline-1 outline-secondary",
          "w-full flex-col rounded-2xl",
          "md:absolute md:left-0 md:right-0 md:ml-auto md:mr-auto md:h-6 md:w-fit md:flex-row md:rounded-3xl",
        )}
        setIsMenuVisible={setMenuIsVisible}
      />
      <div
        className={cn(
          "pointer-events-auto flex w-fit items-center",
          "w-full flex-col space-y-4",
          "md:h-full md:w-auto md:flex-row md:space-x-2 md:space-y-0",
        )}
      >
        {isUserSignedIn && (
          <div
            className="flex h-fit w-full justify-center md:w-fit"
            onClick={() => {
              if (typeof window !== "undefined" && window.screen.width < 782) {
                setMenuIsVisible(false);
              }
            }}
          >
            <NavLink
              href="/tracks"
              nonActiveClassName="outline-primary outline outline-1 text-primary"
              activeClassName="bg-primary text-primary-foreground"
              className={cn(
                "flex h-full w-full justify-center truncate rounded-full px-4 py-1 font-bold",
                "md:h-6 md:w-40 md:py-0",
              )}
            >
              Vos pistes
            </NavLink>
          </div>
        )}
        {isUserSignedIn ? (
          <form
            action={signOutAction}
            className="m-0 flex h-full w-full items-center justify-center  p-0"
          >
            <button
              type="submit"
              className="h-full w-full cursor-pointer text-primary hover:text-primary/80"
            >
              Se déconnecter
            </button>
          </form>
        ) : (
          <Link
            href={"/login"}
            className="cursor-pointer text-primary hover:text-primary/80"
            onClick={() => {
              if (typeof window !== "undefined" && window.screen.width < 782) {
                setMenuIsVisible(false);
              }
            }}
          >
            Connection
          </Link>
        )}
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

export function InProjectNavLinks({
  className,
  setIsMenuVisible,
}: {
  className: string;
  setIsMenuVisible: React.Dispatch<SetStateAction<boolean>>;
}) {
  const path = usePathname();
  const regex = /\/tracks\/\d+\//;
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
          if (typeof window !== "undefined" && window.screen.width < 782) {
            setIsMenuVisible(false);
          }
        }}
      >
        <NavbarProjectButton
          title="Objectifs"
          route={`/tracks/${idOfProject}/objectifs`}
        />
        <NavbarProjectButton
          title="Partage"
          route={`/tracks/${idOfProject}/partage`}
        />
        <NavbarProjectButton
          title="Suivi"
          route={`/tracks/${idOfProject}/suivi/classement`}
          alternateRoute={`/tracks/${idOfProject}/suivi/carte`}
        />
      </div>
    );
  } else {
    return <></>;
  }
}

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
      className="text-md flex h-full w-full items-center justify-center rounded-2xl px-12 font-bold text-secondary md:px-8"
      alternativeActivePath={props.alternateRoute}
    >
      {props.title}
    </NavLink>
  );
};
