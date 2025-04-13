import { NextRequest, NextResponse } from "next/server";
import { getMerchantByUEN } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const merchantUEN = request.nextUrl.searchParams.get("uen");

  if (!merchantUEN) {
    return new NextResponse(
      JSON.stringify({ error: "Merchant UEN is required" }),
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
    const merchants = await getMerchantByUEN(merchantUEN);

    if (merchants.length === 0) {
      return new NextResponse(JSON.stringify({ error: "No merchant found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const merchant = merchants[0];
    return new NextResponse(
      JSON.stringify({
        uen: merchant.uen,
        merchant_name: merchant.merchant_name,
        merchant_username: merchant.merchant_username,
        merchant_wallet_address: merchant.merchant_wallet_address,
        prefer_xsgd: merchant.prefer_xsgd,
        is_vault_enabled: merchant.is_vault_enabled,
        created_at: merchant.created_at,
        updated_at: merchant.updated_at,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching merchant:", error);
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
