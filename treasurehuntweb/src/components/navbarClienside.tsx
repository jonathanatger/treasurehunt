"use client";

import { usePathname } from "next/navigation";
import { NavbarProjectButton } from "./navbar";

export function InProjectNavLinks() {
  const path = usePathname();
  const regex = /\/pistes\/\d+\//;
  const linksAreShown = regex.test(path);

  if (linksAreShown) {
    return (
      <div className="flex h-8 flex-row items-center justify-between rounded-3xl shadow-md outline outline-1 outline-secondary">
        <NavbarProjectButton title="Carte" route="/pistes/1/carte" />
        <NavbarProjectButton title="Partage" route="/pistes/1/partage" />
        <NavbarProjectButton title="Suivi" route="/pistes/1/suivi/classement" />
      </div>
    );
  } else {
    return <></>;
  }
}
