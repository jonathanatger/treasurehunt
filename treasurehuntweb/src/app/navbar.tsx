import Link from "next/link";
import { ReactElement } from "react";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 box-border flex h-12 w-full flex-row justify-between p-4">
      <div className="flex h-fit min-h-fit w-full flex-row items-center justify-between px-4 py-2 ">
        <div>
          <Link href={"/"} className="font-velvendachill text-3xl font-normal">
            TREASURIO
          </Link>
        </div>
        <div className="flex flex-row items-center justify-between rounded-3xl py-1 shadow-md outline outline-1 outline-slate-500">
          <NavbarButton title="Carte" route="/projets/1/carte" />
          <NavbarButton title="Lancement" route="/projets/1/lancement" />
          <NavbarButton title="Participants" route="/projets/1/participants" />
        </div>
        <div>
          <NavbarButton title="Projets" route="/projets" />
          <NavbarButton title="Connection" route="/connection" />
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
    <Link href={`${props.route}`} className="text-md px-4">
      {props.title}
    </Link>
  );
};
