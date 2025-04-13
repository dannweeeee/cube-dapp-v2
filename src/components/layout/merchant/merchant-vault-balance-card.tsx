import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useReadContract } from "wagmi";
import Image from "next/image";
import {
  BASE_SEPOLIA_REGISTRY_ADDRESS,
  BASE_SEPOLIA_VAULT_ADDRESS,
} from "@/lib/constants";
import VaultAbi from "@/abis/VaultAbi";
import RegistryAbi from "@/abis/RegistryAbi";
import { formatUnits } from "viem";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine } from "lucide-react";
import { MerchantWithdrawFundsModal } from "./merchant-withdraw-funds-modal";

interface MerchantVaultBalanceCardProps {
  uen: string;
  name: string;
}

export default function MerchantVaultBalanceCard({
  uen,
  name,
}: MerchantVaultBalanceCardProps) {
  const [isWithdrawalConfirmationOpen, setIsWithdrawalConfirmationOpen] =
    useState(false);
  const [isWithdrawalDisabled, setIsWithdrawalDisabled] = useState(true);

  const { data: registryData } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  const { data: vaultData } = useReadContract({
    abi: VaultAbi,
    address: BASE_SEPOLIA_VAULT_ADDRESS,
    functionName: "balanceOf",
    args: [registryData?.wallet_address as `0x${string}`],
  });

  const formattedBalance = vaultData ? formatUnits(vaultData, 6) : "-";

  useEffect(() => {
    if (Number(vaultData) <= 0) {
      setIsWithdrawalDisabled(true);
    } else {
      setIsWithdrawalDisabled(false);
    }
  }, [vaultData]);

  const handleWithdrawalConfirmationOpen = () => {
    setIsWithdrawalConfirmationOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden border border-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-white">
          <CardTitle className="text-sm font-medium text-primary">
            {name}&apos;s Vault
          </CardTitle>
          <div className="p-1 bg-white rounded-full shadow-sm">
            <Image src="/icons/usdc.svg" alt="USDC" width={24} height={24} />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-1">
            <div className="text-2xl font-bold text-primary">
              {formattedBalance} USDC
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              <p className="text-xs text-muted-foreground">
                Aave USDC Lending Market
              </p>
            </div>
            <p className="text-xs font-medium text-green-600">0.50% APY</p>
          </div>

          <div className="mt-6">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
              onClick={handleWithdrawalConfirmationOpen}
              disabled={isWithdrawalDisabled}
            >
              <ArrowDownToLine className="h-4 w-4" />
              Withdraw Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <MerchantWithdrawFundsModal
        isOpen={isWithdrawalConfirmationOpen}
        onOpenChange={setIsWithdrawalConfirmationOpen}
        uen={uen}
        amount={vaultData || BigInt(0)}
      />
    </>
  );
}
