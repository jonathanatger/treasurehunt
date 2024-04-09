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
import { Navbar } from "./navbar";

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
          "flex min-h-screen flex-col bg-background bg-slate-900 font-sans text-white antialiased",
          fontSans.variable,
          fontTitle.variable,
          fontVelvendaChill.variable,
          fontVelvendaCooler.variable,
          fontVelvendaBlack.variable,
        )}
      >
        <Navbar />
        <TRPCReactProvider>
          <div className="absolute top-16 h-[calc(100%-4rem)] w-full overflow-auto">
            {children}
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
