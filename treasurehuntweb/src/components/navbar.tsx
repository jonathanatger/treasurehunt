import Link from "next/link";
import { NavbarAdditionalLinks } from "./navbarClienside";
import { auth } from "~/auth/auth";
import Image from "next/image";
import logo from "../../public/android-chrome-192x192.png";

export async function Navbar() {
  let isUserSignedIn = false;
  const user = await auth();
  if (user?.user) isUserSignedIn = true;

  return (
    <nav className="fixed top-0 z-50 box-border flex h-16 w-full flex-row items-center justify-between p-4">
      <div className="flex flex-row items-center space-x-2">
        <Image src={logo} width={40} height={40} alt="logo" priority />
        <Link
          href={"/"}
          className="font-velvendachill text-3xl font-normal text-secondary"
        >
          TREASURIO
        </Link>
      </div>
      <NavbarAdditionalLinks user={user} isUserSignedIn={isUserSignedIn} />
    </nav>
  );
}
