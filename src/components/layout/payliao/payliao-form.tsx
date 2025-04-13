"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { toast } from "sonner";
import { Scanner } from "@yudiel/react-qr-scanner";
import { ArrowRight, ScanQrCode, X, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { PayliaoConfirmationModal } from "./payliao-confirmation";
import { useRouter } from "next/navigation";

const payliaoFormSchema = z.object({
  uen: z.string().min(4, "UEN must be at least 4 characters").max(50),
  amount: z.number().min(0),
});

type PayliaoFormValues = z.infer<typeof payliaoFormSchema>;

export function PayliaoForm() {
  const router = useRouter();
  const [scanData, setScanData] = useState<boolean>(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isTransactionInProgress, setIsTransactionInProgress] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PayliaoFormValues>({
    resolver: zodResolver(payliaoFormSchema),
    defaultValues: {
      uen: "",
      amount: 0,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const uen = watch("uen");
  const amount = watch("amount");

  const handleScan = (data: string) => {
    function isLetter(char: string) {
      return char.length === 1 && char.match(/[a-z]/i);
    }

    if (data) {
      console.log("Scanned QR code:", data);

      // Pattern for PromptPay QR codes
      const promptPayPattern =
        /^00020101021130\d{2}0016A00000067701011201(\d{13}|\d{15}).*?5802TH/;

      // Pattern for PayNow QR codes
      const paynowPattern = /PAYNOW01012021[023]([A-Za-z0-9]{10})/;

      // Pattern for NETS QR codes
      const netsPattern = /SG\.COM\.NETS0123([0-9]{9}[A-Z])/;

      const promptPayMatch = data.match(promptPayPattern);
      const paynowMatch = data.match(paynowPattern);
      const netsMatch = data.match(netsPattern);

      let uenValue = "";

      if (promptPayMatch) {
        uenValue = promptPayMatch[1];
        console.log("Parsed QR Data (PromptPay):", uenValue);
      } else if (paynowMatch) {
        // PayNow QR code logic
        const eighthChar = paynowMatch[1][paynowMatch[1].length - 2];

        if (isLetter(eighthChar)) {
          uenValue = paynowMatch[1].slice(0, -1);
          console.log("Parsed QR Data (PayNow 9-character UEN):", uenValue);
        } else {
          uenValue = paynowMatch[1];
          console.log("Parsed QR Data (PayNow 10-character UEN):", uenValue);
        }
      } else if (netsMatch) {
        // NETS QR code logic
        uenValue = netsMatch[1];
        console.log("Parsed QR Data (NETS UEN):", uenValue);
      } else {
        // If no match found, try to find any 9-digit number followed by a letter
        const genericUenPattern = /([0-9]{9}[A-Z])/;
        const genericMatch = data.match(genericUenPattern);

        if (genericMatch) {
          uenValue = genericMatch[1];
          console.log("Parsed QR Data (Generic UEN):", uenValue);
        } else {
          console.log("Unrecognized QR format. Full QR Data:", data);
          uenValue = data;
        }
      }

      setValue("uen", uenValue);
      setScanData(false);
      toast.success("QR code scanned successfully", {
        description: "UEN has been filled automatically",
      });
    }
  };

  const onSubmit = async (data: PayliaoFormValues) => {
    setIsSubmitting(true);
    try {
      setIsConfirmationOpen(true);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "There was an error processing your payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleError = (error: any) => {
    console.error("Transaction error:", error);
    toast.error("Transaction failed. Please try again.");
    setIsTransactionInProgress(false);
  };

  const handleSuccess = () => {
    toast.success("Payment successful!");
    setIsTransactionInProgress(false);
    setIsConfirmationOpen(false);
    router.push("/wallet");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] w-full">
      <motion.div
        className="w-full max-w-md mx-auto px-8 py-8 bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-gray-100 dark:border-neutral-700"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {scanData ? (
          <motion.div variants={containerVariants}>
            <motion.div className="text-center mb-6" variants={itemVariants}>
              <div className="inline-flex items-center justify-center p-3 mb-4 bg-primary/10 rounded-full">
                <ScanQrCode className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-bold text-2xl text-primary mb-3">
                Scan QR Code
              </h2>
              <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                Align camera with QR code to auto-fill UEN input
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center justify-center"
              variants={itemVariants}
            >
              <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
                <Scanner
                  onScan={(result) => {
                    if (result && result.length > 0 && result[0].rawValue) {
                      handleScan(result[0].rawValue);
                    }
                  }}
                  styles={{
                    container: {
                      borderRadius: "12px",
                      overflow: "hidden",
                    },
                    video: {
                      borderRadius: "12px",
                    },
                  }}
                  components={{
                    audio: false,
                    finder: false,
                  }}
                />
              </div>
              <Button
                variant="outline"
                className="mt-6 rounded-xl border-primary/20 hover:bg-primary/5 text-primary font-medium px-5 py-2 h-auto"
                onClick={() => {
                  setScanData(false);
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Scanning
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.form
            className="space-y-6"
            onSubmit={handleSubmit(onSubmit)}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="flex flex-col space-y-2 w-full"
              variants={itemVariants}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center p-3 mb-3 bg-primary/10 rounded-full">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200 mb-2">
                  Make a Payment
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mx-auto dark:text-neutral-300">
                  Enter merchant details to complete your transaction
                </p>
              </div>

              <Label htmlFor="uen" className="text-sm font-medium">
                Merchant UEN
              </Label>
              <div className="relative flex w-full">
                <Input
                  id="uen"
                  placeholder="12345678K"
                  type="text"
                  {...register("uen")}
                  className={cn(
                    "pr-12 rounded-xl border-gray-200 dark:border-neutral-700 focus:border-primary focus:ring-primary/30 h-12 text-base",
                    errors.uen &&
                      "border-red-500 focus:border-red-500 focus:ring-red-300"
                  )}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-9 w-9 text-primary hover:bg-primary/10 rounded-lg"
                    onClick={() => {
                      setScanData(true);
                    }}
                  >
                    <ScanQrCode className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              {errors.uen && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.uen.message}
                </p>
              )}
            </motion.div>

            <motion.div
              className="flex flex-col space-y-2 w-full"
              variants={itemVariants}
            >
              <Label htmlFor="amount" className="text-sm font-medium">
                Amount in SGD
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                  S$
                </span>
                <Input
                  id="amount"
                  placeholder="0.00"
                  type="text"
                  inputMode="decimal"
                  pattern="^\d*\.?\d{0,2}$"
                  min="0"
                  step="0.01"
                  className="pl-10 rounded-xl border-gray-200 dark:border-neutral-700 focus:border-primary focus:ring-primary/30 h-12 text-base"
                  onKeyPress={(
                    event: React.KeyboardEvent<HTMLInputElement>
                  ) => {
                    const target = event.target as HTMLInputElement;
                    if (
                      !/[0-9.]/.test(event.key) ||
                      (event.key === "." && target.value.includes(".")) ||
                      (target.value.includes(".") &&
                        target.value.split(".")[1].length >= 2)
                    ) {
                      event.preventDefault();
                    }
                  }}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "textfield",
                  }}
                  {...register("amount", {
                    setValueAs: (v) => (v === "" ? undefined : parseFloat(v)),
                  })}
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-xs md:text-sm mt-1">
                  {errors.amount.message}
                </p>
              )}
            </motion.div>

            <motion.div className="pt-4" variants={itemVariants}>
              <Button
                className={cn(
                  "w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-lg transition-all duration-300 h-12 text-base",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Processing...</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Pay Now
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>

      <PayliaoConfirmationModal
        isOpen={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        uen={uen}
        sgdAmount={amount}
        onError={handleError}
        onSuccess={handleSuccess}
        isTransactionInProgress={isTransactionInProgress}
      />
    </div>
  );
}
