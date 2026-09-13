import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Input } from "@/components/ui/input";
  import { Pencil } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import { useState, useEffect } from "react";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import useAxios from "@/hooks/useAxios";
  import { showToast } from "@/components/_ui/toast-utils";
  
  // Validation schema
  const stockSchema = z.object({
    price: z.coerce.number().min(0, "Price is required"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
    discount: z.coerce.number().min(0, "Discount must be at least 0"),
  });
  
  export default function EditStock({ stock, onSuccess }) {
      const [open, setOpen] = useState(false);
  const { request, loading } = useAxios();
  
    const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(stockSchema),
      defaultValues: {
        price: stock?.price || 0,
        quantity: stock?.quantity || 1,
        discount: stock?.discount || 0,
      },
    });
  
    const onSubmit = async (values) => {
      const { data, error } = await request({
        method: "PUT",
        url: "/pharmacy/update-stock",
        authRequired: true,
        payload: {
          ...values,
          // pharmacyId: stock?.pharmacyId?._id,
          medicineId: stock?.medicineId?._id,
        },
      });
  
      if (!error) {
        showToast("success", data.message || "Stock updated successfully.");
        setOpen(false);
        onSuccess?.(data.data.stocks);
      } else {
        showToast("error", error);
      }
    };
  
    return (
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (val)
            reset({
              price: stock?.price || 0,
              quantity: stock?.quantity || 1,
              discount: stock?.discount || 0,
            });
        }}
      >
        <DialogTrigger asChild>
          <Button size="icon" variant="outline">
            <Pencil className="w-4 h-4" />
          </Button>
        </DialogTrigger>
  
        <DialogContent className="w-full max-w-lg max-h-[90vh] rounded-lg shadow-lg bg-white dark:bg-gray-950 flex flex-col">
          <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Stock
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
              Update the stock details below.
            </DialogDescription>
          </DialogHeader>
  
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-gray-100 dark:bg-gray-950 p-6 space-y-4 overflow-y-auto flex-1 rounded-lg"
          >
            {/* Price */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Price
              </label>
              <Input
                type="number"
                {...register("price")}
                placeholder="Enter price"
                className="bg-white dark:bg-gray-900"
              />
              {errors.price && <p className="text-red-500 text-sm font-medium">{errors.price.message}</p>}
            </div>
  
            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity
              </label>
              <Input
                type="number"
                {...register("quantity")}
                placeholder="Enter quantity"
                className="bg-white dark:bg-gray-900"
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm font-medium">{errors.quantity.message}</p>
              )}
            </div>
  
            {/* Discount */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Discount
              </label>
              <Input
                type="number"
                {...register("discount")}
                placeholder="Enter discount"
                className="bg-white dark:bg-gray-900"
              />
              {errors.discount && (
                <p className="text-red-500 text-sm font-medium">{errors.discount.message}</p>
              )}
            </div>
  
            <DialogFooter className="pt-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
              <Button type="submit" loading={loading} loadingText="Updating..." className="w-full">
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
  