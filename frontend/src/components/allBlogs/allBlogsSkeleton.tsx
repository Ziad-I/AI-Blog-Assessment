// AllBlogsSkeleton.tsx
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AllBlogsSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="w-full">
            <CardHeader className="pb-0">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-3/4" />
            </CardHeader>
            <CardFooter className="flex justify-between py-2">
              <Skeleton className="h-4 w-32 mr-6" />
              <Skeleton className="h-4 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
