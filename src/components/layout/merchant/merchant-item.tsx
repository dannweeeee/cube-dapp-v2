import { useCheckIfMerchantVaultIsEnabledByUen } from "@/hooks/useCheckIfMerchantVaultIsEnabledByUen";
import MerchantDetailsCard from "./merchant-details-card";
import MerchantVaultBalanceCard from "./merchant-vault-balance-card";

interface MerchantItemProps {
  merchant: {
    uen: string;
    name: string;
    owner: string;
    address: string;
  };
}

export default function MerchantItem({ merchant }: MerchantItemProps) {
  const { isMerchantVaultEnabled } = useCheckIfMerchantVaultIsEnabledByUen(
    merchant.uen
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <MerchantDetailsCard uen={merchant.uen} name={merchant.name} />
      {isMerchantVaultEnabled && (
        <MerchantVaultBalanceCard uen={merchant.uen} name={merchant.name} />
      )}
    </div>
  );
}
