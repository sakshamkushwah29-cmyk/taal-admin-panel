import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PromoBannerSkeleton() {
   return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="shadow-lg rounded-2xl overflow-hidden">
          <div className="relative w-full h-48">
            <Skeleton className="absolute inset-0 w-full h-full" />
          </div>
          <CardContent className="p-4 space-y-3">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-1/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
