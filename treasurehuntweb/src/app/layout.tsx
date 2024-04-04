import "~/styles/globals.css";
import { cn } from "~/lib/utils";

import { Inter, Outfit, Montserrat } from "next/font/google";
import Link from "next/link";
import { TRPCReactProvider } from "~/trpc/client";
import { ReactElement } from "react";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontTitle = Outfit({
  subsets: ["latin"],
  variable: "--font-title",
});

export const metadata = {
  title: "Treasurio",
  description: "All the fun of searching together, as simple as it gets",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  charset: "utf-8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "bg-background flex min-h-screen flex-col bg-slate-800 font-sans text-white antialiased",
          fontSans.variable,
          fontTitle.variable,
        )}
      >
        <nav className="fixed top-0 z-50 box-border flex h-12 w-full flex-row justify-between p-4">
          <div className="flex h-fit min-h-fit w-full flex-row items-center justify-between rounded-3xl px-8 py-2 shadow-md outline outline-1 outline-slate-500">
            <div>
              <Link href={"/"} className="font-title text-2xl font-black">
                TREASURIO
              </Link>
            </div>
            <div className="flex flex-row">
              <NavbarButton title="Tableau de bord" route="/tableau" />
              <NavbarButton title="Prix" route="/prix" />
              <NavbarButton title="Connection" route="/connection" />
            </div>
          </div>
        </nav>
        <TRPCReactProvider>
          <div className="absolute top-16 h-[calc(100%-4rem)] w-full overflow-auto">
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

const NavbarButton = function (props: {
  title: string;
  route: string;
}): ReactElement {
  return (
    <Link href={`${props.route}`} className="pl-8 text-lg">
      {props.title}
    </Link>
  );
};
