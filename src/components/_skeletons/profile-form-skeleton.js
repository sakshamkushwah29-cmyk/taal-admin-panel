import { Skeleton } from "@/components/ui/skeleton"; // ShadCN Skeleton

const fields = [
  { name: "name" },
  { name: "email" },
  { name: "phone" },
  { name: "address" },
];

export default function ProfileFormSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {fields.map(({ name }) => (
        <div key={name} className="col-span-1">
          <Skeleton className="h-5 w-32 mb-2" /> {/* Label Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" /> {/* Input Skeleton */}
        </div>
      ))}
      {/* Button Skeleton */}
      <div className="col-span-1 md:col-span-2 flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}
