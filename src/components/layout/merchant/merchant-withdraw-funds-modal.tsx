"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_SEPOLIA_EXCHANGE_V2_ADDRESS,
  BASE_SEPOLIA_VAULT_ADDRESS,
} from "@/lib/constants";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import UsdcAbi from "@/abis/UsdcAbi";
import ExchangeV2Abi from "@/abis/ExchangeV2Abi";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { waitForTransactionReceipt, writeContract } from "wagmi/actions";
import { wagmiConfig } from "@/components/config/wagmiConfig";
import Image from "next/image";
import { ArrowDownToLine, CheckCircle, Loader2 } from "lucide-react";

interface MerchantWithdrawFundsModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uen: string;
  amount: bigint;
}

export function MerchantWithdrawFundsModal({
  isOpen,
  onOpenChange,
  uen,
  amount,
}: MerchantWithdrawFundsModalProps) {
  const account = useAccount();
  const router = useRouter();
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);
  const [isTransactionComplete, setIsTransactionComplete] = useState(false);

  const formattedAmount = useMemo(() => {
    return formatUnits(amount, 6);
  }, [amount]);

  const handleWithdrawFunds = async () => {
    setIsTransactionInProgress(true);
    try {
      const approvalHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_VAULT_ADDRESS,
        abi: UsdcAbi,
        functionName: "approve",
        args: [BASE_SEPOLIA_EXCHANGE_V2_ADDRESS, amount as bigint],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: approvalHash });

      const transferHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_EXCHANGE_V2_ADDRESS,
        abi: ExchangeV2Abi,
        functionName: "withdrawToWallet",
        args: [amount as bigint],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: transferHash });
      setIsTransactionComplete(true);
      setTimeout(() => {
        onOpenChange(false);
        router.refresh();
      }, 2000);
    } catch (error) {
      console.error("Transaction failed:", error);
    } finally {
      setIsTransactionInProgress(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl">
        <div className="p-6 bg-gradient-to-r from-blue-50/80 to-indigo-50/80">
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-3">
              <div className="p-2.5 bg-white rounded-full shadow-sm ring-1 ring-blue-100">
                <Image
                  src="/icons/usdc.svg"
                  alt="USDC"
                  width={28}
                  height={28}
                  className="drop-shadow-sm"
                />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-primary/90">
              Confirm Withdrawal
            </DialogTitle>
            <DialogDescription className="text-center text-sm mt-2 text-neutral-600/90">
              Please review the withdrawal details below
            </DialogDescription>
          </DialogHeader>

          <div className="mt-5 space-y-4 bg-white rounded-xl p-5 border border-gray-100/80 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-neutral-500">
                Merchant UEN
              </span>
              <span className="font-semibold text-neutral-800">{uen}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-neutral-500">
                Amount
              </span>
              <div className="text-right">
                <div className="font-bold text-lg text-primary flex items-center gap-2">
                  <Image
                    src="/icons/usdc.svg"
                    alt="USDC"
                    width={18}
                    height={18}
                  />
                  {formattedAmount} USDC
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-sm font-medium text-neutral-500">
                Destination
              </span>
              <span className="font-medium text-neutral-800 text-sm bg-gray-50 px-2 py-1 rounded-md">
                {account.address?.slice(0, 6)}...{account.address?.slice(-4)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-3 flex flex-col gap-3">
          {isTransactionComplete ? (
            <div className="flex items-center justify-center py-2 px-4 bg-green-50 rounded-lg border border-green-100">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700 font-medium text-sm">
                Withdrawal successful!
              </p>
            </div>
          ) : (
            <Button
              onClick={handleWithdrawFunds}
              disabled={isTransactionInProgress}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-sm"
            >
              {isTransactionInProgress ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="h-4 w-4" />
                  <span className="text-sm">Confirm Withdrawal</span>
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
