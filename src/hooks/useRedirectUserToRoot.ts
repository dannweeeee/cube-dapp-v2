import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { useCubeContext } from "@/contexts/cube-provider";

export const useRedirectUserToRoot = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { user } = useCubeContext();

  useEffect(() => {
    if (!isConnected || !address) {
      router.push("/");
    }
  }, [isConnected, router, address, user]);
};
