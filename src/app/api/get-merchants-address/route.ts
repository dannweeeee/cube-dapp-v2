import { NextResponse } from "next/server";
import { getMerchantsWalletAddress } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const merchants = await getMerchantsWalletAddress();
    return new NextResponse(JSON.stringify(merchants), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching merchants:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error fetching merchants" }),
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
