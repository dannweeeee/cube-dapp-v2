import { NextResponse } from "next/server";
import { createTransaction } from "@/db/queries/insert";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const transactionData = await request.json();
    await createTransaction(transactionData);
    return new NextResponse(
      JSON.stringify({ message: "Transaction created successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error creating transaction:", error);
    return new NextResponse(
      JSON.stringify({ error: "Error creating transaction" }),
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
