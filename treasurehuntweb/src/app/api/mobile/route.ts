import { headers } from "next/headers";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  // const res = await fetch("https://data.mongodb-api.com/...", {
  //   headers: {
  //     "Content-Type": "application/json",
  //     "API-Key": process.env.DATA_API_KEY,
  //   } as HeadersInit,
  // });

  // const data = await res.json();

  const data = { message: "this is data from the api" };

  return Response.json({ data });
}
