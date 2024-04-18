"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavbarProjectButton } from "./navbar";

export function InProjectNavLinks() {
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
      <div className="flex h-8 flex-row items-center justify-between rounded-3xl shadow-md outline outline-1 outline-secondary">
        <NavbarProjectButton
          title="Carte"
          route={`/pistes/${idOfProject}/carte`}
        />
        <NavbarProjectButton
          title="Partage"
          route={`/pistes/${idOfProject}/partage`}
        />
        <NavbarProjectButton
          title="Suivi"
          route={`/pistes/${idOfProject}/suivi/classement`}
        />
      </div>
    );
  } else {
    return <></>;
  }
}
