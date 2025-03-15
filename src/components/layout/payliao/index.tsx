import { Badge } from "@/components/ui/badge";
import { ScanQrCode } from "lucide-react";

export default function PayliaoComponent() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 text-primary p-2">
          <ScanQrCode className="w-4 h-4 mr-1" />
          Payliao
        </Badge>
      </div>
    </div>
  );
}
