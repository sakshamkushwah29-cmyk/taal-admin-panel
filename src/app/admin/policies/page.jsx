// "use client";

// import React, { useEffect, useState } from "react";
// import useAxios from "@/hooks/useAxios";
// import AdminDashboardLayout from "../page";
// import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
// import { Plus, ShieldCheck } from "lucide-react";
// import PrivacyPolicySkeleton from "@/components/_skeletons/privacy-policy-skeleton";
// import EditPolicies from "@/components/_dialogs/EditPolicies";
// import ViewPolicies from "@/components/_dialogs/ViewPolicies";
// import { format } from "date-fns";

// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { Card } from "@/components/ui/card";
// import DeletePolicies from "@/components/_dialogs/DeletePolicies";
// import AddPolicyPage from "./add-policy/page";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// const PrivacyPolicyPage = () => {
//   const [policies, setPolicies] = useState([]);
//   const { request: fetchPolicy, loading: policyLoading } = useAxios();
//   const router = useRouter();

//   const fetchPolicies = async () => {
//     try {
//       const { data, error } = await fetchPolicy({
//         method: "GET",
//         url: "/superadmin/get-all-policy",
//         authRequired: true,
//       });
//       if (!error && data?.data) {
//         const policyTypes = ["privacy", "terms"];
//         const policiesArray = [];

//         userTypes.forEach((userType) => {
//           const policyObj = data.data[userType] || {};

//           policyTypes.forEach((type) => {
//             if (policyObj[type]) {
//               policiesArray.push({
//                 ...policyObj[type],
//                 userType,
//                 type,
//                 updatedAt: policyObj.updatedAt || policyObj[type].updatedAt,
//                 _id: policyObj[type]._id || `${userType}-${type}`,
//               });
//             } else {
//               policiesArray.push({
//                 userType,
//                 type,
//                 _id: `${userType}-${type}-na`,
//                 notAvailable: true,
//               });
//             }
//           });
//         });

//         setPolicies(policiesArray);
//       }
//     } catch (error) {
//       console.error("Error fetching policies:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPolicies();
//   }, []);

//   const groupedPolicies = policies.reduce((acc, policy) => {
//     const key = policy.type;
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(policy);
//     return acc;
//   }, {});

//   return (
//     <AdminDashboardLayout>
//       <AppBreadcrumb />
//       <div className="p-3">
//         <div className="mb-6">
//           <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary">
//             <ShieldCheck className="w-6 h-6" />
//             Privacy Policies & Guidelines
//           </h2>
//           <p className="text-muted-foreground text-sm mt-1">
//             Stay informed about how we handle your data and ensure your privacy.
//           </p>
//         </div>

//         {policyLoading ? (
//           <PrivacyPolicySkeleton />
//         ) : policies.length === 0 ? (
//           <div className="border rounded-xl text-center text-muted-foreground bg-muted p-4">
//             No privacy policies found.
//           </div>
//         ) : (
//           <Accordion type="multiple" className="w-full space-y-4">
//             {["privacy", "terms"].map((type) => (
//               <AccordionItem key={type} value={type}>
//                 <AccordionTrigger className="text-lg font-semibold capitalize cursor-pointer text-primary">
//                   {type === "privacy" ? "Privacy Policies" : "Terms of Use"}
//                 </AccordionTrigger>
//                 <AccordionContent className="bg-muted/40 rounded-b-xl">
//                   <div className="">
//                     {(groupedPolicies[type] || []).map((policy) => (
//                       // <Card
//                       //   key={policy._id}
//                       //   className="px-4 py-3 my-2 bg-white rounded-xl"
//                       // >
//                       //   <div className="flex flex-wrap justify-between items-center gap-y-4">

//                       //     <div className="w-full sm:w-auto">
//                       //       <h3 className="text-lg font-semibold text-primary capitalize">
//                       //         {policy.userType}
//                       //       </h3>
//                       //     </div>

//                       //     <div className="w-full sm:flex-2 sm:mr-5 text-left lg:text-center text-sm text-muted-foreground font-medium">
//                       //       {policy.notAvailable ? (
//                       //         <span className="text-destructive font-semibold">
//                       //           Not Available

//                       //         </span>
//                       //       ) : (
//                       //         <>
//                       //           {policy.updatedAt
//                       //             ? format(new Date(policy.updatedAt), "MMMM d, yyyy")
//                       //             : "N/A"}
//                       //         </>
//                       //       )}
//                       //     </div>

//                       //     {policy.notAvailable && (

//                       //       <Button onClick={() => router.push("/admin/policies/add-policy")}>
//                       //         <Plus className="w-4 h-4 mr-2" />
//                       //         Add Policy
//                       //       </Button>
//                       //     )}

//                       //     {!policy.notAvailable && (
//                       //       <div className="w-20 my-3 sm:my-0 sm:w-auto flex gap-2 justify-end">
//                       //         <EditPolicies
//                       //           policy={policy}
//                       //           onSuccess={(editedPolicy) => {
//                       //             if (!editedPolicy) return;
//                       //             setPolicies((prev) =>
//                       //               prev.map((p) => (p._id === editedPolicy._id ? editedPolicy : p))
//                       //             );
//                       //           }}
//                       //         />
//                       //         <ViewPolicies policy={policy} />
//                       //         <DeletePolicies
//                       //           policy={policy}
//                       //           onSuccess={(deletedId) => {
//                       //             if (!deletedId) return;

//                       //             setPolicies((prev) => {
//                       //                const updated = prev.filter((p) => p._id !== deletedId);
//                       //                const deletedPolicy = prev.find((p) => p._id === deletedId);
//                       //               if (deletedPolicy) {
//                       //                 updated.push({
//                       //                   userType: deletedPolicy.userType,
//                       //                   type: deletedPolicy.type,
//                       //                   _id: `${deletedPolicy.userType}-${deletedPolicy.type}-na`,
//                       //                   notAvailable: true,
//                       //                 });
//                       //               }

//                       //               return updated;
//                       //             });
//                       //           }}
//                       //         />
//                       //       </div>
//                       //     )}
//                       //   </div>
//                       // </Card>

//                       <Card
//                         key={policy._id}
//                         className="px-4 py-3 my-2 bg-white rounded-xl"
//                       >
//                         <div className="flex flex-wrap justify-between items-center gap-y-4">
//                           <div className="w-full sm:w-auto">
//                             <h3 className="text-lg font-semibold text-primary capitalize">
//                               {policy.userType}
//                             </h3>
//                             {policy.updatedAt && !policy.notAvailable && (
//                               <p className="text-sm text-muted-foreground">
//                                 Last updated:{" "}
//                                 {format(new Date(policy.updatedAt), "PPP")}
//                               </p>
//                             )}
//                             {policy.notAvailable && (
//                               <p className="text-sm text-red-500">
//                                 Not available
//                               </p>
//                             )}
//                           </div>

//                           {!policy.notAvailable && (
//                             <div className="flex gap-2">
//                               <ViewPolicies policy={policy} />
//                               <EditPolicies
//                                 policy={policy}
//                                 onSuccess={fetchPolicies}
//                               />
//                               <DeletePolicies
//                                 policy={policy}
//                                 onSuccess={fetchPolicies}
//                               />
//                             </div>
//                           )}

//                           {policy.notAvailable && (
//                             <div>
//                               <Button
//                                 size="sm"
//                                 onClick={() => {
//                                   router.push(
//                                     `/admin/policies/add-policy?userType=${policy.userType}&type=${policy.type}`
//                                   );
//                                 }}
//                                 className="cursor-pointer"
//                               >
//                                 <Plus className="w-4 h-4 mr-2" />
//                                 Add Policy
//                               </Button>
//                             </div>
//                           )}
//                         </div>
//                       </Card>
//                     ))}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             ))}
//           </Accordion>
//         )}
//       </div>
//     </AdminDashboardLayout>
//   );
// };

// export default PrivacyPolicyPage;



"use client";

import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import AdminDashboardLayout from "../page";
import AppBreadcrumb from "@/components/_ui/app-breadcrumb";
import { ShieldCheck, Plus } from "lucide-react";
import PrivacyPolicySkeleton from "@/components/_skeletons/privacy-policy-skeleton";
import EditPolicies from "@/components/_dialogs/EditPolicies";
import ViewPolicies from "@/components/_dialogs/ViewPolicies";
import DeletePolicies from "@/components/_dialogs/DeletePolicies";
import { format } from "date-fns";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const PrivacyPolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const { request: fetchPolicy, loading: policyLoading } = useAxios();
  const router = useRouter();

  const fetchPolicies = async () => {
    try {
      const { data, error } = await fetchPolicy({
        method: "GET",
        url: "/superadmin/get-all-policy",
        authRequired: true,
      });

      if (!error && data?.data) {
        setPolicies(data.data);
      }
    } catch (error) {
      console.error("Error fetching policies:", error);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const groupedPolicies = policies.reduce((acc, policy) => {
    const key =
      policy.type === "privacy_policy" ? "privacy" : "terms_conditions";
    if (!acc[key]) acc[key] = [];
    acc[key].push(policy);
    return acc;
  }, {});

  return (
    <AdminDashboardLayout>
      <AppBreadcrumb />
      <div className="p-3">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2 text-primary">
            <ShieldCheck className="w-6 h-6" />
            Privacy Policies & Guidelines
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Stay informed about how we handle your data and ensure your privacy.
          </p>
        </div>

        {policyLoading ? (
          <PrivacyPolicySkeleton />
        ) : policies.length === 0 ? (
          <div className="border rounded-xl text-center text-muted-foreground bg-muted p-4">
            No privacy policies found.
          </div>
        ) : (
          <Accordion type="multiple" className="w-full space-y-4">
            {["privacy", "terms_conditions"].map((type) => (
              <AccordionItem key={type} value={type}>
                <AccordionTrigger className="text-lg font-semibold capitalize cursor-pointer text-primary">
                  {type === "privacy"
                    ? "Privacy Policy"
                    : "Terms & Conditions"}
                </AccordionTrigger>
                <AccordionContent className="bg-muted/40 rounded-b-xl">
                  <div className="">
                    {(groupedPolicies[type] || []).map((policy) => (
                      <Card
                        key={policy._id}
                        className="px-4 py-3 my-2 bg-white rounded-xl"
                      >
                        <div className="flex flex-wrap justify-between items-center gap-y-4">
                          <div className="w-full sm:w-auto">
                            <h3 className="text-lg font-semibold text-primary capitalize">
                              {policy.title}
                            </h3>
                            {policy.updatedAt && (
                              <p className="text-sm text-muted-foreground">
                                Last updated:{" "}
                                {format(new Date(policy.updatedAt), "PPP")}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <ViewPolicies policy={policy} />
                            <EditPolicies
                              policy={policy} staticType={type} onSuccess={fetchPolicies}
                            />
                            <DeletePolicies
                              policy={policy}
                              onSuccess={fetchPolicies}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default PrivacyPolicyPage;
