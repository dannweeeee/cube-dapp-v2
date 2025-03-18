import { NextResponse } from "next/server";
import { createMerchant } from "@/db/queries/insert";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const merchantData = await request.json();
    await createMerchant(merchantData);
    return new NextResponse(
      JSON.stringify({ message: "Merchant registered successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error registering merchant:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error registering merchant" }),
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
