import { useState, useEffect } from "react";
import { User } from "@/lib/types";

export function useFetchUserDetailsByAddress(walletAddress: string | null) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      if (!walletAddress) {
        setUser(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/get-user-by-address?address=${walletAddress}`,
          {
            method: "GET",
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
            credentials: "same-origin",
          }
        );

        // Log the full response for debugging
        console.log("Response:", {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error("Detailed error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [walletAddress]);

  return { user, loading, error };
}
