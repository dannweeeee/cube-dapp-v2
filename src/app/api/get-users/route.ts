import { NextResponse } from "next/server";
import { getUsers } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await getUsers();
    return new NextResponse(JSON.stringify(users), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching users:", error);
    return new NextResponse(JSON.stringify({ error: "Error fetching users" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}
