// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import dynamic from "next/dynamic";
// import {
//   Dialog,
//   DialogTrigger,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Pencil } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import useAxios from "@/hooks/useAxios";
// import { showToast } from "@/components/_ui/toast-utils";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

// const typeOptions = ["Privacy", "erms"];
// const userTypeOptions = ["customer", "pharmacy", "delivery", "pathology"];

// const policySchema = z.object({
//   content: z.string().min(20, "Content must be at least 20 characters"),
// });

// export default function EditPolicies({ policy, onSuccess }) {
//   const [open, setOpen] = useState(false);
//   const { request } = useAxios();

//   const editor = useRef(null);


//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     reset,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     resolver: zodResolver(policySchema),
//     defaultValues: {
//       type: policy.type || "privacy",
//       userType: policy.userType || "customer",
//       content: policy.content || "",
//     },
//   });

//   const content = watch("content");

//   useEffect(() => {
//     if (open && policy) {
//       reset({
//         type: policy.type || "Privacy",
//         userType: policy.userType || "Customer",
//         content: policy.content || "",
//       });
//     }
//   }, [open, policy, reset]);

//   const onSubmit = async (values) => {
//     const { data, error } = await request({
//       method: "POST",
//       url: "/superadmin/create-or-update-policy",
//       authRequired: true,
//       payload: {
//         policyId: policy._id,
//         ...values,
//       },
//     });
//     if (!error) {
//       showToast("success", data?.message || "Policy updated successfully.");
//       setOpen(false);
//       onSuccess(data?.data?.policy);
//     } else {
//       showToast("error", error);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button size="icon" variant="outline" aria-label="Edit Policy">
//           <Pencil className="w-4 h-4" />
//         </Button>
//       </DialogTrigger>
//       <DialogContent
//       style = {{maxWidth: "80vw"}}  
//       className="h-[90vh] [max-width:80vw] overflow-hidden flex flex-col">
//         <DialogHeader className="bg-white dark:bg-gray-950 p-6 border-b">
//           <DialogTitle className="text-lg font-semibold">Edit Policy</DialogTitle>
           
//         </DialogHeader>
//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50 dark:bg-gray-950"
//         >
//           <div className="flex lg:gap-12 gap-6">
//             <div className="space-y-2">
//               <Label>Policy Type</Label>
//               <input
//                 type="text"
//                 value={watch("type")}
//                 disabled
//                 className="w-20 border border-input rounded-md px-3 py-2 text-sm bg-muted"
//               />
//             </div>


//             <div className="flex lg:gap-12 gap-6">
//               <div className="space-y-2">
//                 <Label>User Type</Label>
//                 <input
//                   type="text"
//                   value={watch("userType")}
//                   disabled
//                   className="w-25 border border-input rounded-md px-3 py-2 text-sm bg-muted"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label>Policy Content (HTML)</Label>
//             <JoditEditor
//               ref={editor}
//               value={content}
//               onChange={(val) => setValue("content", val, { shouldValidate: true })}
//             />
 
//             {errors.content && (
//               <p className="text-red-500 text-sm">{errors.content.message}</p>
//             )}
//           </div>

//           <div className="space-y-2">
//             <Label>Live Preview</Label>
//             <div
//               className="prose dark:prose-invert p-4 border rounded-md bg-white dark:bg-gray-900 max-h-72 overflow-auto"
//               dangerouslySetInnerHTML={{ __html: content }}
//             />
//           </div>

//           <DialogFooter className="pt-4 border-t bg-white dark:bg-gray-950 flex justify-end gap-3">
//             <Button type="button" variant="outline" onClick={() => setOpen(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" loading={isSubmitting} loadingText="Updating...">
//               Update Policy
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }


"use client";
import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAxios from "@/hooks/useAxios";
import { showToast } from "@/components/_ui/toast-utils";
import { Label } from "@/components/ui/label";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const policySchema = z.object({
  content: z.string().min(20, "Content must be at least 20 characters"),
});

export default function EditPolicies({ policy, onSuccess, staticType }) {
  const [open, setOpen] = useState(false);
  const { request } = useAxios();
  const editor = useRef(null);

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(policySchema),
    defaultValues: {
      type: staticType || policy.type,
      content: policy.content || "",
    },
  });

  const content = watch("content");

  useEffect(() => {
    if (open && policy) {
      reset({
        type: staticType || policy.type,
        content: policy.content || "",
      });
    }
  }, [open, policy, reset, staticType]);

  const onSubmit = async (values) => {
    const { data, error } = await request({
      method: "POST",
      url: "/superadmin/create-or-update-policy",
      authRequired: true,
      payload: {
        policyId: policy._id,
        type: staticType || policy.type, // static type
        content: values.content,
        title: policy.title,
      },
    });
    if (!error) {
      showToast("success", data?.message || "Policy updated successfully.");
      setOpen(false);
      onSuccess(data?.data?.policy);
    } else {
      showToast("error", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" aria-label="Edit Policy">
          <Pencil className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{ maxWidth: "80vw" }}
        className="h-[90vh] [max-width:80vw] overflow-hidden flex flex-col"
      >
        <DialogHeader className="bg-white dark:bg-gray-950 p-6 border-b">
          <DialogTitle className="text-lg font-semibold">Edit Policy</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50 dark:bg-gray-950"
        >
          <div className="space-y-2">
            <Label>Policy Type</Label>
            <input
              type="text"
              value={staticType || watch("type")}
              disabled
              className="w-40 border border-input rounded-md px-3 py-2 text-sm bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>Policy Content (HTML)</Label>
            <JoditEditor
              ref={editor}
              value={content}
              onChange={(val) => setValue("content", val, { shouldValidate: true })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Live Preview</Label>
            <div
              className="prose dark:prose-invert p-4 border rounded-md bg-white dark:bg-gray-900 max-h-72 overflow-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>

          <DialogFooter className="pt-4 border-t bg-white dark:bg-gray-950 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting} loadingText="Updating...">
              Update Policy
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
