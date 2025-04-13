"use client";

import { useFetchUserDetailsByAddress } from "@/hooks/useFetchUserDetailsByAddress";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { Merchant, PortfolioData, User } from "@/lib/types";
import { useContext, createContext, useEffect } from "react";
import { useAccount } from "wagmi";

interface CubeProviderProps {
  children: React.ReactNode;
}

interface CubeContextType {
  user: User | null;
  portfolioData: PortfolioData | null;
}

const CubeContext = createContext<CubeContextType | null>(null);

export const useCubeContext = () => {
  const context = useContext(CubeContext);
  if (!context) {
    throw new Error("useCube must be used within a CubeProvider");
  }
  return context;
};

export const CubeProvider = ({ children }: CubeProviderProps) => {
  const { address, isConnected } = useAccount();
  const { user } = useFetchUserDetailsByAddress(address || null);
  const { portfolioData } = usePortfolioData(address, isConnected);

  return (
    <CubeContext.Provider value={{ user, portfolioData }}>
      {children}
    </CubeContext.Provider>
  );
};
