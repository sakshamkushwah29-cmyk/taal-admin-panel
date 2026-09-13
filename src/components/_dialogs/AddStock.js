"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { debounce } from "lodash";
import * as z from "zod";
import { showToast } from "@/components/_ui/toast-utils";
import useAxios from "@/hooks/useAxios";
import { ChevronsUpDown } from "lucide-react";

const stockSchema = z.object({
  medicines: z.array(
    z.object({
      medicineId: z.string().min(1, "Medicine is required"),
      quantity: z.preprocess((val) => Number(val), z.number().min(1)),
      price: z.preprocess((val) => Number(val), z.number().min(0)),
      discount: z.preprocess((val) => Number(val), z.number().min(0)),
      name: z.string().optional(), // Add name to schema
    })
  ),
});

export default function AddStock({ onSuccess }) {
  const [open, setOpen] = useState(false);
  const { request: addStock, loading } = useAxios();
  const { request: getAllMedicines } = useAxios();
  const { request: searchMedicine } = useAxios();

  const [openCombobox, setOpenCombobox] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const [medicinesList, setMedicinesList] = useState([]);
  const [selectedMedicines, setSelectedMedicines] = useState([]);
  const [medicinePages, setMedicinePages] = useState([]); // Track page per dropdown
  const dropdownRefs = useRef([]);
  const debouncedFetchMedicines = useRef([]);
  const [highlightedIndexes, setHighlightedIndexes] = useState([]); // for keyboard navigation per dropdown

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stockSchema),
    defaultValues: {
      medicines: [{ medicineId: "", quantity: 0, price: 0, discount: 0, name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  // Sync selectedMedicines length with fields length
  useEffect(() => {
    setSelectedMedicines((prev) => {
      const updated = [...prev];
      while (updated.length < fields.length) updated.push(null);
      while (updated.length > fields.length) updated.pop();
      return updated;
    });
  }, [fields.length]);

  const fetchMedicines = async (idx, query = "", page = 1) => {
    setDropdownLoading((prev) => {
      const updated = [...prev];
      updated[idx] = true;
      return updated;
    });
    try {
      let data;
      if (query) {
        ({ data } = await searchMedicine({
          method: "GET",
          url: `/pharmacy/search-medicine?query=${encodeURIComponent(query)}`,
          authRequired: true,
        }));
      } else {
        ({ data } = await getAllMedicines({
          method: "GET",
          url: `/pharmacy/get-all-medicines?page=${page}&limit=20`,
          authRequired: true,
        }));
      }
      const list = (data?.data?.data || []).map((med) => ({
        id: med._id,
        name: med.name,
        price: med.price ?? 0,
        discount: 0,
      }));
      setMedicinesList((prev) => {
        const updated = [...prev];
        updated[idx] = list;
        return updated;
      });
      setMedicinePages((prev) => {
        const updated = [...prev];
        updated[idx] = page;
        return updated;
      });
      // Track if there are more pages (for Load More button)
      // We'll use data.data.hasNextPage if available, else infer from list length
      return {
        hasNextPage: data?.data?.hasNextPage ?? (list.length === 20),
      };
    } finally {
      setDropdownLoading((prev) => {
        const updated = [...prev];
        updated[idx] = false;
        return updated;
      });
    }
  };

  const handleMedicineChange = (id, idx) => {
    const med = (medicinesList[idx] || []).find((m) => m.id === id);
    if (med) {
      // Set quantity to 1 if not set or <= 0
      setValue(`medicines.${idx}.medicineId`, med.id);
      setValue(`medicines.${idx}.name`, med.name); // Set name in form
      setValue(`medicines.${idx}.discount`, med.discount);
      // Get current quantity
      let currentQuantity = 1;
      try {
        // Try to get the current value from the form
        const q = control._formValues?.medicines?.[idx]?.quantity;
        if (typeof q === 'number' && q > 0) currentQuantity = q;
      } catch {}
      setValue(`medicines.${idx}.quantity`, currentQuantity);
      setValue(`medicines.${idx}.price`, med.price * currentQuantity);
      setSelectedMedicines((prev) => {
        const updated = [...prev];
        updated[idx] = med;
        return updated;
      });
    }
  };

  const resetDropdownState = () => {
    setOpenCombobox(Array(fields.length).fill(false));
    setDropdownLoading(Array(fields.length).fill(false));
    setSearchInput(Array(fields.length).fill(""));
    setMedicinesList([]);
    setSelectedMedicines([]);
    dropdownRefs.current = Array(fields.length).fill(null);
  };

  useEffect(() => {
    setOpenCombobox(Array(fields.length).fill(false));
    setDropdownLoading(Array(fields.length).fill(false));
    setSearchInput(Array(fields.length).fill(""));
    setMedicinesList(Array(fields.length).fill([]));
    setSelectedMedicines(Array(fields.length).fill(null));
    setMedicinePages(Array(fields.length).fill(1));
    dropdownRefs.current = Array(fields.length).fill(null);
    setHighlightedIndexes(Array(fields.length).fill(-1));
    // Initialize debounced functions for each field
    debouncedFetchMedicines.current = fields.map((_, idx) =>
      debounce((val) => {
        const trimmed = val.trim();
        setMedicinePages((prev) => {
          const updated = [...prev];
          updated[idx] = 1;
          return updated;
        });
        if (trimmed) {
          fetchMedicines(idx, trimmed, 1);
        } else {
          // If empty, fetch the default list
          fetchMedicines(idx, "", 1);
        }
        setHighlightedIndexes((prev) => {
          const updated = [...prev];
          updated[idx] = -1;
          return updated;
        });
      }, 500)
    );
  }, [fields.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      dropdownRefs.current.forEach((ref, idx) => {
        if (ref && !ref.contains(event.target)) {
          setOpenCombobox((prev) => {
            const updated = [...prev];
            updated[idx] = false;
            return updated;
          });
          setHighlightedIndexes((prev) => {
            const updated = [...prev];
            updated[idx] = -1;
            return updated;
          });
        }
      });
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSubmit = async (formData) => {
    const { data, error } = await addStock({
      method: "POST",
      url: "/pharmacy/create-stock",
      payload: formData,
      authRequired: true,
    });

    // Custom error handling for duplicate stock
    if (error) {
      // Try to match the error pattern
      const match = /Stock already exists for medicineId: ([a-fA-F0-9]+)/.exec(error);
      if (match) {
        const duplicateId = match[1];
        // Try to find the medicine name from selectedMedicines or formData
        let medicineName = null;
        // Try selectedMedicines first
        if (Array.isArray(selectedMedicines)) {
          const found = selectedMedicines.find((med) => med && med.id === duplicateId);
          if (found) medicineName = found.name;
        }
        // Fallback: try formData.medicines
        if (!medicineName && Array.isArray(formData.medicines)) {
          const found = formData.medicines.find((med) => med.medicineId === duplicateId);
          if (found && found.name) medicineName = found.name;
        }
        // Fallback: just show the ID if name not found
        showToast(
          "error",
          medicineName
            ? `Stock already exists for "${medicineName}".`
            : `Stock already exists for medicineId: ${duplicateId}`
        );
        return;
      }
      // Default error
      return showToast("error", error);
    }

    showToast("success", data?.message || "Stock added!");
    reset();
    resetDropdownState();
    setOpen(false);
    if (typeof onSuccess === "function") onSuccess();
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Add Stock</Button>
      <Dialog
        open={open}
        onOpenChange={(val) => {
          setOpen(val);
          if (!val) {
            reset();
            resetDropdownState();
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden rounded-xl">
          <DialogHeader>
            <DialogTitle>Add Stock</DialogTitle>
            <DialogDescription>Enter stock details below</DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 max-h-[calc(90vh-6rem)] overflow-auto"
          >
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border p-4 rounded-md space-y-3 relative"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm">Medicine {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        remove(index);
                        setSelectedMedicines((prev) => {
                          const updated = [...prev];
                          updated.splice(index, 1);
                          return updated;
                        });
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                {/* Medicine dropdown */}
                <div className="space-y-1">
                  <Label>Medicine</Label>
                  <Controller
                    name={`medicines.${index}.medicineId`}
                    control={control}
                    render={({ field }) => (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenCombobox((prev) => {
                              const updated = [...prev];
                              updated[index] = !prev[index];
                              return updated;
                            });
                            // Reset page to 1 on open
                            setMedicinePages((prev) => {
                              const updated = [...prev];
                              updated[index] = 1;
                              return updated;
                            });
                            fetchMedicines(index);
                            setHighlightedIndexes((prev) => {
                              const updated = [...prev];
                              updated[index] = -1;
                              return updated;
                            });
                          }}
                          className="w-full flex justify-between items-center border rounded-md px-3 py-2 bg-background text-sm"
                        >
                          <span>
                            {field.value
                              ? selectedMedicines[index]?.name ||
                              (medicinesList[index] || []).find(
                                (m) => m.id === field.value
                              )?.name ||
                              "Select Medicine..."
                              : "Select Medicine..."}
                          </span>
                          <ChevronsUpDown className="h-4 w-4 opacity-50" />
                        </button>

                        {openCombobox[index] && (
                          <div
                            className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-75 overflow-y-auto"
                            ref={(el) => (dropdownRefs.current[index] = el)}
                          >
                            <input
                              type="text"
                              placeholder="Search medicines..."
                              className="w-full p-2 border-b text-sm outline-none"
                              value={searchInput[index] || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSearchInput((prev) => {
                                  const updated = [...prev];
                                  updated[index] = val;
                                  return updated;
                                });
                                // Debounced, trimmed search
                                debouncedFetchMedicines.current[index](val);
                                setHighlightedIndexes((prev) => {
                                  const updated = [...prev];
                                  updated[index] = -1;
                                  return updated;
                                });
                              }}
                             onKeyDown={e => {
                               if (!openCombobox[index] || (medicinesList[index] || []).length === 0) return;
                               if (e.key === "ArrowDown") {
                                 e.preventDefault();
                                 setHighlightedIndexes(prev => {
                                   const updated = [...prev];
                                   const list = medicinesList[index] || [];
                                   updated[index] = (prev[index] + 1) % list.length;
                                   return updated;
                                 });
                               } else if (e.key === "ArrowUp") {
                                 e.preventDefault();
                                 setHighlightedIndexes(prev => {
                                   const updated = [...prev];
                                   const list = medicinesList[index] || [];
                                   updated[index] = (prev[index] - 1 + list.length) % list.length;
                                   return updated;
                                 });
                               } else if (e.key === "Enter") {
                                 if (highlightedIndexes[index] >= 0 && highlightedIndexes[index] < (medicinesList[index] || []).length) {
                                   e.preventDefault();
                                   const med = (medicinesList[index] || [])[highlightedIndexes[index]];
                                   field.onChange(med.id);
                                   handleMedicineChange(med.id, index);
                                   setOpenCombobox((prev) => {
                                     const updated = [...prev];
                                     updated[index] = false;
                                     return updated;
                                   });
                                   setHighlightedIndexes((prev) => {
                                     const updated = [...prev];
                                     updated[index] = -1;
                                     return updated;
                                   });
                                 }
                               }
                             }}
                            />
                            {dropdownLoading[index] ? (
                              <p className="p-2 text-sm text-muted-foreground">
                                Loading...
                              </p>
                            ) : (medicinesList[index] || []).length === 0 ? (
                              <p className="p-2 text-sm text-muted-foreground">
                                No medicine found.
                              </p>
                            ) : (
                              <>
                                <ul className="text-sm max-h-52 overflow-auto">
                                  {(medicinesList[index] || []).map((med, idx2) => (
                                    <li
                                      key={med.id}
                                      className={`px-3 py-2 cursor-pointer hover:bg-muted ${field.value === med.id ? "bg-muted font-medium" : ""} ${highlightedIndexes[index] === idx2 ? "bg-gray-200" : ""}`}
                                      onClick={() => {
                                        field.onChange(med.id);
                                        handleMedicineChange(med.id, index);
                                        setOpenCombobox((prev) => {
                                          const updated = [...prev];
                                          updated[index] = false;
                                          return updated;
                                        });
                                        setHighlightedIndexes((prev) => {
                                          const updated = [...prev];
                                          updated[index] = -1;
                                          return updated;
                                        });
                                      }}
                                      onMouseEnter={() => setHighlightedIndexes((prev) => {
                                        const updated = [...prev];
                                        updated[index] = idx2;
                                        return updated;
                                      })}
                                    >
                                      {med.name}
                                    </li>
                                  ))}
                                </ul>
                                {/* Load More button for pagination */}
                                <div className="flex justify-center p-2">
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={async () => {
                                      const nextPage = (medicinePages[index] || 1) + 1;
                                      await fetchMedicines(index, searchInput[index] || "", nextPage);
                                    }}
                                    disabled={dropdownLoading[index]}
                                  >
                                    Load More
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  />
                  {errors?.medicines?.[index]?.medicineId && (
                    <p className="text-xs text-red-500">
                      {errors.medicines[index].medicineId?.message}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="space-y-1">
                  <Label>Quantity</Label>
                  <Controller
                    name={`medicines.${index}.quantity`}
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter quantity"
                        min={1}
                        value={field.value || ""}
                        onChange={e => {
                          let val = e.target.value;
                          // Allow empty string for clearing
                          if (val === "") {
                            field.onChange("");
                            setValue(`medicines.${index}.price`, 0);
                            return;
                          }
                          val = Number(val);
                          if (isNaN(val) || val <= 0) {
                            field.onChange("");
                            setValue(`medicines.${index}.price`, 0);
                            return;
                          }
                          field.onChange(val);
                          // Update price if medicine is selected
                          const med = selectedMedicines[index];
                          if (med && med.price) {
                            setValue(`medicines.${index}.price`, med.price * val);
                          } else {
                            setValue(`medicines.${index}.price`, 0);
                          }
                        }}
                        onWheel={e => e.target.blur()}
                      />
                    )}
                  />
                  {errors?.medicines?.[index]?.quantity && (
                    <p className="text-xs text-red-500">
                      {errors.medicines[index].quantity?.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <Label>Price</Label>
                  <Controller
                    name={`medicines.${index}.price`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="number" placeholder="Price" readOnly />
                    )}
                  />
                </div>

                {/* Discount */}
                <div className="space-y-1">
                  <Label>Discount</Label>
                  <Controller
                    name={`medicines.${index}.discount`}
                    control={control}
                    render={({ field }) => (
                      <Input {...field} type="number" placeholder="Enter discount" />
                    )}
                  />
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                append({ medicineId: "", quantity: 0, price: 0, discount: 0, name: "" })
              }
            >
              + Add Another Medicine
            </Button>

            <div className="pt-4 flex gap-2 border-t">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => {
                  setOpen(false);
                  reset();
                  resetDropdownState();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" loading={loading} loadingText="Saving..." className="w-1/2">
                Save
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}