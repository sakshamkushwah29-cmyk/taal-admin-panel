"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export default function ViewPolicies({ policy }) {
  const [open, setOpen] = useState(false);
  
  const { type, updatedAt, userType, content } = policy;

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    : "N/A";


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="hover:bg-muted transition-colors"
          aria-label="View Privacy Policy"
        >
          <Eye size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent
        // style={{ maxWidth: "60rem" }}
        className="w-full max-w-95 h-[90vh] max-h-[90vh] md:h-[90vh] [max-width:95vw] md:[max-width:80vw] overflow-hidden rounded-xl p-4 md:p-9 border shadow-xl flex flex-col bg-white dark:bg-gray-900"
      >

       <DialogHeader className="px-4 md:px-10 py-4 md:py-6 border-b bg-background sticky top-0 z-20">
          <DialogTitle className="text-xl md:text-2xl lg:text-3xl font-extrabold text-foreground leading-tight">
            {type === "privacy" ? "Privacy Policy" : "Terms of Use"}
          </DialogTitle>
          <div className="mt-2 flex flex-col md:flex-row md:flex-wrap gap-2 md:gap-6 text-xs md:text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-foreground">Last updated:</span>
              <span className="break-words">{formattedDate}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-foreground">Type:</span>
              <span>{type || "N/A"}</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <span className="font-semibold text-foreground">Applicable user:</span>
              <span>{userType || "N/A"}</span>
            </div>
          </div>
        </DialogHeader>

        <main
            className="flex-1 overflow-y-auto px-4 md:px-10 py-4 md:py-8 prose prose-sm md:prose-lg max-w-none md:max-w-4xl mx-auto text-justify text-foreground dark:prose-invert"
        >
          <div 
            className="text-sm md:text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content || "<p>No content available.</p>" }} 
          />
        </main>
 
      </DialogContent>
    </Dialog>
  );
}
