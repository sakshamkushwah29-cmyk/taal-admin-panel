// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { FiChevronRight } from "react-icons/fi";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { useAuthUser } from "@/contexts/AuthContext";

// // Mapping for cleaner names
// const routeNames = {
//   // ===== Auth Routes =====
//   "": "Login",
//   "forget-password": "Forgot Password",
//   "reset-password": "Reset Password",
//   profile: "Profile",

//   // ===== Admin Routes =====
//   admin: "Admin Dashboard",
//   pathology: "Pathology",
//   pharmacy: "Pharmacy",
//   settings: "Settings",
//   users: "Users",
//   delivery: "Delivery",
//   insurance: "Insurance",
//   nursingCare: "Nursing Care",

//   // ===== Admin Pathology Subroutes =====
//   "test-category": "Test Category",
//   "test-management": "Test Management",

//   // ===== Pathology Routes =====
//   tests: "Tests",
//   reports: "Reports",
//   patients: "Patients",
//   appointments: "Appointments",

//   // ===== Pharmacy Routes =====
//   medicines: "Medicines",
//   inventory: "Inventory",
//   suppliers: "Suppliers",
//   orders: "Orders",
//   offers: "Offers & Events",
//   policies: "Content & Policies",
  

// };

// export default function AppBreadcrumb() {
//   const pathname = usePathname();
//   const pathSegments = pathname.split("/").filter(Boolean);

//   // Automatically derive base dashboard URL like /pharmacy, /pathology, /admin
//   const baseSegment = pathSegments[0];
//   const dashboardHref = `/${baseSegment}`;

//   const segments = pathSegments.map((segment, index) => {
//     const isLast = index === pathSegments.length - 1;
//     const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
//     const name =
//       routeNames[segment] ||
//       segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

//     return { name, href, isLast };
//   });

//   return (
//     <Breadcrumb className="flex items-center text-gray-500 dark:text-gray-400 lg:font-medium">
//       {/* Dynamic Dashboard link */}
//       <BreadcrumbItem>
//         <Link
//           href={dashboardHref}
//           className="hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-1 rounded-md transition-all capitalize"
//         >
//           {routeNames[baseSegment] || baseSegment}
//         </Link>
//       </BreadcrumbItem>

//       {segments.slice(1).map(({ name, href, isLast }) => (
//         <span key={href} className="flex items-center">
//           <BreadcrumbSeparator className="inline-flex items-center mx-1.5">
//             <FiChevronRight className="text-gray-400 text-sm" />
//           </BreadcrumbSeparator>

//           <BreadcrumbItem>
//             {!isLast ? (
//               <Link
//                 href={href}
//                 className="hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-1 rounded-md transition-all capitalize"
//               >
//                 {name}
//               </Link>
//             ) : (
//               <span className="text-gray-600 dark:text-gray-300 capitalize">
//                 {name}
//               </span>
//             )}
//           </BreadcrumbItem>
//         </span>
//       ))}
//     </Breadcrumb>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiChevronRight } from "react-icons/fi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Mapping for cleaner names
const routeNames = {
  "": "Login",
  "forget-password": "Forgot Password",
  "reset-password": "Reset Password",
  profile: "Profile",

  admin: "Admin Dashboard",
  pathology: "Pathology",
  pharmacy: "Pharmacy",
  settings: "Settings",
  users: "Users",
  delivery: "Delivery",
  insurance: "Insurance",
  nursingCare: "Nursing Care",

  "test-category": "Test Category",
  "test-management": "Test Management",

  tests: "Tests",
  reports: "Reports",
  patients: "Patients",
  appointments: "Appointments",

  medicines: "Medicines",
  inventory: "Inventory",
  suppliers: "Suppliers",
  orders: "Orders",
  offers: "Offers & Events",
  policies: "Content & Policies",
};

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const baseSegment = pathSegments[0];
  const dashboardHref = `/${baseSegment}`;

  const segments = pathSegments.map((segment, index) => {
    const isLast = index === pathSegments.length - 1;
    const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
    const name =
      routeNames[segment] ||
      segment.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return { name, href, isLast };
  });

  return (
    <div className="overflow-x-auto w-full">
      <Breadcrumb className="flex whitespace-nowrap text-gray-500 dark:text-gray-400 lg:font-medium min-w-max">
        {/* Dashboard link */}
        <BreadcrumbItem>
          <Link
            href={dashboardHref}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-1 rounded-md transition-all capitalize"
          >
            {routeNames[baseSegment] || baseSegment}
          </Link>
        </BreadcrumbItem>

        {segments.slice(1).map(({ name, href, isLast }) => (
          <span key={href} className="flex items-center">
            <BreadcrumbSeparator className="inline-flex items-center mx-1.5">
              <FiChevronRight className="text-gray-400 text-sm" />
            </BreadcrumbSeparator>

            <BreadcrumbItem>
              {!isLast ? (
                <Link
                  href={href}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 px-1 py-1 rounded-md transition-all capitalize"
                >
                  {name}
                </Link>
              ) : (
                <span className="text-gray-600 dark:text-gray-300 capitalize">
                  {name}
                </span>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </Breadcrumb>
    </div>
  );
}
