import { Skeleton } from "@/components/ui/skeleton";

export default function BlogSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-3" />
        <Skeleton className="h-4 w-32 mb-6" />

        <div className="space-y-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-4 ${
                i % 4 === 0
                  ? "w-full"
                  : i % 4 === 1
                  ? "w-11/12"
                  : i % 4 === 2
                  ? "w-5/6"
                  : "w-2/3"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
