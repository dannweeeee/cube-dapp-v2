import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";

export function useFetchUserTransactionsByAddress(
  walletAddress: string | null
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      if (!walletAddress) {
        setTransactions([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-transaction-by-address?user_wallet_address=${walletAddress}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setTransactions(data);
        } else if (data.message === "No transactions found") {
          setTransactions([]);
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, [walletAddress]);

  return { transactions, loading, error };
}
