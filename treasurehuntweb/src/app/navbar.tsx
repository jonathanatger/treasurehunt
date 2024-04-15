import Link from "next/link";
import { ReactElement } from "react";

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
        <div className="flex flex-row items-center justify-between rounded-3xl py-1 shadow-md outline outline-1 outline-slate-500">
          <NavbarButton title="Carte" route="/pistes/1/carte" />
          <NavbarButton title="Partage" route="/pistes/1/partage" />
          <NavbarButton title="Suivi" route="/pistes/1/suivi/classement" />
        </div>
        <div>
          <NavbarButton title="Vos pistes" route="/pistes" />
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
    <Link href={`${props.route}`} className="text-md px-4 text-primary">
      {props.title}
    </Link>
  );
};
