"use client";

import { Badge } from "@/components/ui/badge";
import { ActivityIcon } from "lucide-react";
import TransactionsTable from "./transactions-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function ActivityComponent() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-10 max-w-7xl">
      <div className="flex justify-center md:justify-start">
        <Badge className="bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary/90 p-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 border border-primary/20 hover:border-primary/30">
          <ActivityIcon className="w-5 h-5 mr-2" />
          <span className="font-medium text-sm">Activity</span>
        </Badge>
      </div>

      <div className="flex flex-col gap-6 md:gap-10">
        <div className="w-full overflow-hidden rounded-xl shadow-md border border-gray-100">
          {isLoading ? (
            <Skeleton className="h-72 w-full rounded-xl" />
          ) : (
            <TransactionsTable />
          )}
        </div>
      </div>
    </div>
  );
}
