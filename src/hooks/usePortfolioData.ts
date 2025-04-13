import { useState, useEffect } from "react";
import { Address } from "viem";
import { useUserEthBalance } from "./useUserEthBalance";
import { useUserUsdcBalance } from "./useUserUsdcBalance";
import { useUserXsgdBalance } from "./useUserXsgdBalance";
import { usePublicClient } from "wagmi";
import { getTokenPrices } from "@/service/alchemy";
import { PortfolioData } from "@/lib/types";

export function usePortfolioData(address: Address | undefined, ready: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  const shouldFetch = ready && address;

  const {
    balance: ethBalance,
    isLoading: ethLoading,
    error: ethError,
  } = useUserEthBalance(shouldFetch ? address : undefined);

  const {
    balance: usdcBalance,
    isLoading: usdcLoading,
    error: usdcError,
  } = useUserUsdcBalance(shouldFetch ? address : undefined);

  const {
    balance: xsgdBalance,
    isLoading: xsgdLoading,
    error: xsgdError,
  } = useUserXsgdBalance(shouldFetch ? address : undefined);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!shouldFetch) {
        setPortfolioData(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const balances = [
          { symbol: "ETH", name: "Ethereum", balance: parseFloat(ethBalance) },
          {
            symbol: "USDC",
            name: "USD Coin",
            balance: parseFloat(usdcBalance),
          },
          { symbol: "XSGD", name: "XSGD", balance: parseFloat(xsgdBalance) },
        ];

        const prices = await getTokenPrices(
          balances.map((token) => token.symbol)
        );

        const tokens = balances.map((token) => {
          const price = prices.get(token.symbol) || 0;
          const value = token.balance * price;
          return {
            ...token,
            price,
            value,
            percentage: 0,
          };
        });

        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

        // Calculate percentages
        tokens.forEach((token) => {
          token.percentage =
            totalValue > 0 ? (token.value / totalValue) * 100 : 0;
        });

        setPortfolioData({ tokens, totalValue });
      } catch (err) {
        setError("Failed to fetch portfolio data. Please try again.");
        console.error("Error fetching portfolio data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (!ethLoading && !usdcLoading && !xsgdLoading) {
      fetchPortfolioData();
    }
  }, [shouldFetch, ethBalance, usdcBalance, xsgdBalance]);

  useEffect(() => {
    const errors = [ethError, usdcError, xsgdError]
      .filter((err): err is Error => err !== null)
      .map((err) => err.message);

    if (errors.length > 0) {
      setError(errors.join(", "));
    }
  }, [ethError, usdcError, xsgdError]);

  return {
    isLoading: isLoading || ethLoading || usdcLoading || xsgdLoading,
    portfolioData,
    error,
  };
}
