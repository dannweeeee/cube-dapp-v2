import { Badge } from "@/components/ui/badge";
import { LayoutDashboard } from "lucide-react";

export default function HomeComponent() {
  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 md:py-8 space-y-4 md:space-y-8">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 text-primary p-2">
          <LayoutDashboard className="w-4 h-4 mr-1" />
          Home
        </Badge>
      </div>
    </div>
  );
}
