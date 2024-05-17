import "~/styles/globals.css";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/client";
import {
  fontSans,
  fontTitle,
  fontVelvendaBlack,
  fontVelvendaChill,
  fontVelvendaCooler,
} from "./fonts/fonts";
import { Navbar } from "../components/navbar";

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
      <TRPCReactProvider>
        <body
          className={cn(
            "flex min-h-screen flex-col bg-background font-sans text-black antialiased",
            fontSans.variable,
            fontTitle.variable,
            fontVelvendaChill.variable,
            fontVelvendaCooler.variable,
            fontVelvendaBlack.variable,
          )}
        >
          <Navbar />
          <div className="absolute top-10 h-[calc(100%-4rem)] w-full overflow-auto p-4 md:top-14">
            {children}
          </div>
        </body>
      </TRPCReactProvider>
    </html>
  );
}
