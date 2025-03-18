import { NextResponse } from "next/server";
import { createUser } from "@/db/queries/insert";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    await createUser(userData);
    return new NextResponse(
      JSON.stringify({ message: "User registered successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error registering user" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}
