"use client";

import React, { useState } from "react";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAccount } from "wagmi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useFetchUserDetailsByAddress } from "@/hooks/useFetchUserDetailsByAddress";
import { registerMerchant } from "@/helpers/register-merchant";
import { toast } from "sonner";
import { ArrowRight, ScanQrCode, Store, X } from "lucide-react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useIsMobile } from "@/hooks/useIsMobile";

const merchantRegistrationFormSchema = z.object({
  uen: z.string().min(4, "UEN must be at least 4 characters").max(50),
  merchantname: z
    .string()
    .min(4, "Name must be at least 4 characters")
    .max(100),
  vault: z.boolean(),
});

type RegistrationFormValues = z.infer<typeof merchantRegistrationFormSchema>;

export default function MerchantRegistrationModal() {
  const [open, setOpen] = useState(false);
  const [scanData, setScanData] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(merchantRegistrationFormSchema),
    defaultValues: {
      uen: "",
      merchantname: "",
      vault: false,
    },
  });

  const router = useRouter();
  const { address } = useAccount();

  const { user } = useFetchUserDetailsByAddress(address || null);

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

  const onSubmit = async (data: RegistrationFormValues) => {
    if (address && user) {
      try {
        setIsSubmitting(true);
        console.log("DATA", data);

        const hash = await registerMerchant(
          data.uen,
          data.merchantname,
          user.username,
          address
        );

        if (hash) {
          console.log("TRANSACTION HASH", hash);
          try {
            const response = await axios.post("/api/create-merchant", {
              uen: data.uen,
              merchant_name: data.merchantname,
              username: user.username,
              merchant_wallet_address: address,
              is_vault_enabled: data.vault,
            });

            console.log("Merchant registered successfully", response);
            toast.success("Merchant registered successfully.");
          } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
              const errorData = error.response.data;
              let errorMessage =
                "There was a problem with your request. Please try again.";

              if (
                errorData.error &&
                errorData.error.includes("duplicate key value")
              ) {
                if (errorData.error.includes("uen")) {
                  errorMessage = "This UEN is already registered.";
                }
              }

              toast.error("Uh oh! Something went wrong ser.", {
                description: errorMessage,
              });
              throw new Error(errorMessage);
            }
          }
        }
        setOpen(false);
        router.push("/merchant");
      } catch (error) {
        console.error("Error registering merchant:", error);
        toast.error("Registration Error", {
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error("Registration Error", {
        description: "User information or wallet address is missing.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex flex-col items-center justify-center gap-1 md:gap-2 h-16 w-16 md:h-20 md:w-20 rounded-xl bg-gradient-to-br from-primary/80 to-primary hover:from-primary hover:to-primary/90 shadow-md hover:shadow-xl transition-all duration-300 border-0">
          <Store className="w-4 h-4 md:w-5 md:h-5 text-white" />
          <span className="text-white text-xs md:text-sm font-medium">
            Register
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg p-0 overflow-hidden border border-primary/10 bg-white/95 backdrop-blur-sm">
        <DialogHeader className="p-6 pb-2 bg-gradient-to-r from-primary/10 to-primary/5">
          <DialogTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <Store className="w-5 h-5" />
            Register Merchant
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Join Cube&apos;s Merchant Network on BASE (Sepolia)
          </DialogDescription>
        </DialogHeader>
        <div className="w-full mx-auto px-6 pb-6 pt-2 bg-transparent">
          {scanData ? (
            <>
              <div className="text-center mb-4">
                <h2 className="font-bold text-xl text-primary mb-2">
                  Scan QR Code
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto mb-4">
                  Align camera with QR code to auto-fill UEN input
                </p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <div className="w-full max-w-xs mx-auto rounded-xl overflow-hidden border border-primary/20 shadow-md">
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
                  className="mt-5 rounded-xl border-primary/20 hover:bg-primary/5 text-primary"
                  onClick={() => {
                    setScanData(false);
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Scanning
                </Button>
              </div>
            </>
          ) : (
            <form className="mt-4 space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <LabelInputContainer>
                <Label htmlFor="uen" className="text-sm font-medium">
                  Merchant UEN
                </Label>
                <div className="relative flex w-full">
                  <Input
                    id="uen"
                    placeholder="00022100K"
                    type="text"
                    {...register("uen")}
                    className={cn(
                      "pr-12 rounded-xl border-primary/20 focus:border-primary focus:ring-primary/30",
                      errors.uen &&
                        "border-red-500 focus:border-red-500 focus:ring-red-300"
                    )}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-primary hover:bg-primary/10 rounded-lg"
                      onClick={() => {
                        setScanData(true);
                      }}
                    >
                      <ScanQrCode className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {errors.uen && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.uen.message}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="merchantname" className="text-sm font-medium">
                  Merchant Name
                </Label>
                <Input
                  id="merchantname"
                  placeholder="333 Carrot Cake"
                  type="text"
                  {...register("merchantname")}
                  className={cn(
                    "rounded-xl border-primary/20 focus:border-primary focus:ring-primary/30",
                    errors.merchantname &&
                      "border-red-500 focus:border-red-500 focus:ring-red-300"
                  )}
                />
                {errors.merchantname && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.merchantname.message}
                  </p>
                )}
              </LabelInputContainer>

              <LabelInputContainer className="pt-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="vault" className="text-sm font-medium">
                    Enable Cube Vault
                  </Label>
                  <Controller
                    name="vault"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        id="vault"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-primary"
                      />
                    )}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Cube vaults are yield-generating vaults that earn interest on
                  your funds
                </p>
              </LabelInputContainer>

              <div className="pt-4">
                <Button
                  className={cn(
                    "w-full rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium shadow-md transition-all duration-300 h-11",
                    isSubmitting && "opacity-70 cursor-not-allowed"
                  )}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-pulse">Registering...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Register Merchant
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 w-full", className)}>
      {children}
    </div>
  );
};
