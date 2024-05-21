import Link from "next/link";
import { NavbarAdditionalLinks } from "./navbarClienside";
import { auth } from "~/auth/auth";

export async function Navbar() {
  let isUserSignedIn = false;
  const user = await auth();
  if (user?.user) isUserSignedIn = true;

  return (
    <nav className="fixed top-0 z-50 box-border flex h-16 w-full flex-row items-center justify-between  p-4">
      <Link
        href={"/"}
        className="font-velvendachill text-3xl font-normal text-primary"
      >
        TREASURIO
      </Link>
      <NavbarAdditionalLinks user={user} isUserSignedIn={isUserSignedIn} />
    </nav>
  );
}
