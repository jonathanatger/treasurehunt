import { Oswald, Roboto } from "next/font/google";
import localFont from "next/font/local";

export const fontSans = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  variable: "--font-sans",
});

export const fontTitle = Oswald({
  subsets: ["latin"],
  variable: "--font-title",
});

export const fontVelvendaChill = localFont({
  src: "./VelvendaChill.otf",
  style: "display",
  variable: "--font-velvenda-chill",
});

export const fontVelvendaCooler = localFont({
  src: "./VelvendaCooler.otf",
  style: "display",
  variable: "--font-velvenda-cooler",
});

export const fontVelvendaBlack = localFont({
  src: "./VelvendaMegablack.otf",
  style: "display",
  variable: "--font-velvenda-black",
});
