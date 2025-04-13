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
  BASE_SEPOLIA_REGISTRY_ADDRESS,
  BASE_SEPOLIA_USDC_ADDRESS,
  BASE_SEPOLIA_XSGD_ADDRESS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { writeContract, waitForTransactionReceipt } from "wagmi/actions";
import RegistryAbi from "@/abis/RegistryAbi";
import { formatUnits } from "viem";
import ExchangeV2Abi from "@/abis/ExchangeV2Abi";
import { wagmiConfig } from "@/components/config/wagmiConfig";
import UsdcAbi from "@/abis/UsdcAbi";
import XsgdAbi from "@/abis/XsgdAbi";
import { useCheckIfMerchantChoseXsgd } from "@/hooks/useCheckIfMerchantChoseXsgd";
import { useCheckIfMerchantVaultIsEnabledByUen } from "@/hooks/useCheckIfMerchantVaultIsEnabledByUen";

interface PayliaoConfirmationModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  uen: string;
  sgdAmount: number;
  onError: (error: any) => void;
  onSuccess: () => void;
  isTransactionInProgress: boolean;
}

export function PayliaoConfirmationModal({
  isOpen,
  onOpenChange,
  uen,
  sgdAmount,
  onError,
  onSuccess,
  isTransactionInProgress,
}: PayliaoConfirmationModalProps) {
  const { address } = useAccount();
  const { isMerchantVaultEnabled } = useCheckIfMerchantVaultIsEnabledByUen(uen);
  const { isMerchantChoseXsgd } = useCheckIfMerchantChoseXsgd(uen);

  console.log("isMerchantVaultEnabled", isMerchantVaultEnabled);
  console.log("isMerchantChoseXsgd", isMerchantChoseXsgd);

  const validSgdAmount = isNaN(sgdAmount) ? 0 : sgdAmount;
  const usdcAmount = BigInt(Math.ceil(validSgdAmount * 0.77 * 10 ** 6));
  const xsgdAmount = BigInt(Math.ceil(validSgdAmount * 10 ** 18));
  const formattedUsdcAmount = formatUnits(usdcAmount, 6);

  const { data } = useReadContract({
    abi: RegistryAbi,
    address: BASE_SEPOLIA_REGISTRY_ADDRESS,
    functionName: "getMerchantByUEN",
    args: [uen],
  });

  const handleApproveAndTransferToMerchantVaultCall = async () => {
    console.log("Approving and Transferring USDC to Merchant Vault");

    try {
      const approvalHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_USDC_ADDRESS,
        abi: UsdcAbi,
        functionName: "approve",
        args: [BASE_SEPOLIA_EXCHANGE_V2_ADDRESS, usdcAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: approvalHash });

      const transferHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_EXCHANGE_V2_ADDRESS,
        abi: ExchangeV2Abi,
        functionName: "transferToVault",
        args: [uen, usdcAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: transferHash });

      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const handleApproveAndTransferXsgdToMerchantWalletCall = async () => {
    console.log("Approving and Transferring XSGD to Merchant Wallet");

    try {
      const approvalHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_XSGD_ADDRESS,
        abi: XsgdAbi,
        functionName: "approve",
        args: [BASE_SEPOLIA_EXCHANGE_V2_ADDRESS, xsgdAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: approvalHash });

      const transferHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_EXCHANGE_V2_ADDRESS,
        abi: ExchangeV2Abi,
        functionName: "transferXsgdToMerchant",
        args: [uen, xsgdAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: transferHash });

      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  const handleApproveAndTransferUsdcToMerchantWalletCall = async () => {
    try {
      console.log("Approving and Transferring USDC to Merchant Wallet");
      const approvalHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_USDC_ADDRESS,
        abi: UsdcAbi,
        functionName: "approve",
        args: [BASE_SEPOLIA_EXCHANGE_V2_ADDRESS, usdcAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: approvalHash });

      const transferHash = await writeContract(wagmiConfig, {
        address: BASE_SEPOLIA_EXCHANGE_V2_ADDRESS,
        abi: ExchangeV2Abi,
        functionName: "transferUsdcToMerchant",
        args: [uen, usdcAmount],
        chainId: BASE_SEPOLIA_CHAIN_ID,
      });

      await waitForTransactionReceipt(wagmiConfig, { hash: transferHash });

      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] w-[95vw] max-h-[90vh] overflow-y-auto p-0 border border-primary/10 bg-white/95 backdrop-blur-sm rounded-xl">
        <div className="p-6 bg-gradient-to-r from-primary/10 to-primary/5">
          <DialogHeader className="mb-4">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
            </div>
            <DialogTitle className="text-xl font-bold text-center text-primary">
              Confirm Payment
            </DialogTitle>
            <DialogDescription className="text-center text-sm mt-2 text-neutral-600">
              Please review the payment details below
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4 bg-white/80 rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">Merchant</span>
              <span className="font-semibold text-neutral-800">
                Merchant: <strong>{data?.entity_name}</strong>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">UEN</span>
              <span className="font-semibold text-neutral-800">{uen}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm text-neutral-500">Amount</span>
              <div className="text-right">
                <div className="font-bold text-lg text-primary">
                  {validSgdAmount} SGD
                </div>
                <div className="text-xs text-neutral-500">
                  {validSgdAmount} SGD ≈ {formattedUsdcAmount} USDC
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-2 flex flex-col gap-3">
          {isMerchantVaultEnabled ? (
            <Button
              className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 transition-all"
              disabled={isTransactionInProgress}
              onClick={handleApproveAndTransferToMerchantVaultCall}
            >
              Pay
              {isTransactionInProgress && (
                <span className="ml-2 animate-pulse">...</span>
              )}
            </Button>
          ) : (
            <Button
              className="w-full py-6 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium flex items-center justify-center gap-2 transition-all"
              disabled={isTransactionInProgress}
              onClick={
                isMerchantChoseXsgd
                  ? handleApproveAndTransferXsgdToMerchantWalletCall
                  : handleApproveAndTransferUsdcToMerchantWalletCall
              }
            >
              Pay
              {isTransactionInProgress && (
                <span className="ml-2 animate-pulse">...</span>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
