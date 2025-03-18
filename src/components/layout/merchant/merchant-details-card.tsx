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
    <Card className="overflow-hidden border border-primary/10 shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-blue-50 to-white">
        <CardTitle className="text-sm font-medium text-primary">
          {name}
        </CardTitle>
        <div className="p-1 bg-white rounded-full shadow-sm">
          <Store className="w-5 h-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-muted-foreground">Merchant UEN</p>
          <div className="text-2xl font-bold text-primary">{uen}</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            <p className="text-xs text-muted-foreground">
              Registered on BASE (Sepolia)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
