import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useCubeContext } from "@/contexts/cube-provider";

export const useRedirectUserToWallet = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { user } = useCubeContext();

  useEffect(() => {
    if (isConnected && address) {
      if (user) {
        router.push("/wallet");
      }
    }
  }, [isConnected, router, address, user]);
};
