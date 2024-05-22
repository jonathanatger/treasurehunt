"use client";

import { launchGame } from "~/lib/serverActions";
import NavLink from "~/components/ui/NavLink";

export function ProjectTrackingClientComponents() {
  return (
    <>
      <div className="flex w-full flex-1 flex-row items-center justify-around rounded-full shadow-lg outline outline-1 outline-primary md:mx-2 md:h-8 md:grow">
        <NavSubLink route="classement" title="Classement" />
        <NavSubLink route="carte" title="Carte" />
      </div>
      <form
        action={launchGame}
        className="flex min-h-[40px] w-full max-w-96 flex-1 justify-center rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 hover:font-bold active:outline active:outline-2 active:outline-secondary md:h-full md:w-96"
      >
        <button className=" h-full w-full active:outline-2" type="submit">
          Lancer la partie !
        </button>
      </form>
    </>
  );
}

const NavSubLink = function (props: {
  title: string;
  route: string;
}): React.ReactNode {
  return (
    <NavLink
      href={`${props.route}`}
      activeClassName="bg-primary text-primary-foreground"
      nonActiveClassName="hover:bg-indigo-100"
      className="text-md flex h-full w-full items-center justify-center rounded-full px-12 font-bold text-primary"
    >
      {props.title}
    </NavLink>
  );
};
