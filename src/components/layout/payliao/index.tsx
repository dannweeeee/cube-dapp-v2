import { Badge } from "@/components/ui/badge";
import { ScanQrCode } from "lucide-react";

export default function PayliaoComponent() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10 max-w-7xl">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105">
          <ScanQrCode className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Payliao</span>
        </Badge>
      </div>
      <div className="flex flex-col gap-4 md:gap-8"></div>
    </div>
  );
}
