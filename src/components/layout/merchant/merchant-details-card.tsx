import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

interface MerchantDetailsCardProps {
  uen: string;
  name: string;
}

export default function MerchantDetailsCard({
  uen,
  name,
}: MerchantDetailsCardProps) {
  return (
    <Card className="bg-white/50 shadow rounded-lg p-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Store className="w-5 h-5" />
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground mb-2">Merchant UEN</p>
        <div className="text-2xl font-bold">UEN: {uen}</div>
      </CardContent>
    </Card>
  );
}
