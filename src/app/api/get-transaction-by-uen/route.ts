import { NextRequest, NextResponse } from "next/server";
import { getTransactionsByUEN } from "@/db/queries/select";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const merchantUEN = request.nextUrl.searchParams.get("merchant_uen");

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
    const transactions = await getTransactionsByUEN(merchantUEN);

    if (transactions.length === 0) {
      return new NextResponse(
        JSON.stringify({ error: "No transactions found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    return new NextResponse(JSON.stringify(transactions), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
