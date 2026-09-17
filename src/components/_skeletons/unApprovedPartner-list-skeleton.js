import React from "react";
import { Skeleton } from "../ui/skeleton";

export default function UnapprovedPartnersSkeleton() {
  return (
    <div className="px-4 py-3 max-h-[300px] overflow-auto">
      <table className="w-full table-auto text-sm text-left text-gray-800 dark:text-gray-200">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
          <tr>
            {["Name", "Email", "Phone", "Action"].map((_, i) => (
              <th key={i} className="py-2 px-3 border-b font-medium">
                <Skeleton className="h-3 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(3)].map((_, idx) => (
            <tr
              key={idx}
              className={`${
                idx % 2 === 0
                  ? "bg-white dark:bg-gray-950"
                  : "bg-gray-50 dark:bg-gray-900"
              } transition-colors duration-150`}
            >
              <td className="py-2 px-3 border-b">
                <Skeleton className="h-3 w-24" />
              </td>
              <td className="py-2 px-3 border-b">
                <Skeleton className="h-3 w-28" />
              </td>
              <td className="py-2 px-3 border-b">
                <Skeleton className="h-3 w-20" />
              </td>
              <td className="py-2 px-3 border-b text-center">
                <div className="flex justify-center gap-1">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
