import { NextRequest, NextResponse } from "next/server";
import { getUserByWalletAddress } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  console.log("API route hit");

  const walletAddress = request.nextUrl.searchParams.get("address");
  console.log("Requested wallet address:", walletAddress);

  if (!walletAddress) {
    return new NextResponse(
      JSON.stringify({ error: "Wallet address is required" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }

  try {
    const users = await getUserByWalletAddress(walletAddress);
    console.log("Found users:", users);

    return new NextResponse(JSON.stringify({ user: users[0] || null }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
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
