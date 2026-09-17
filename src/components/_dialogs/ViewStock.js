import { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

const InfoField = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-100">{value || "N/A"}</p>
    </div>
);

export default function ViewStock({ stock }) {
    const [open, setOpen] = useState(false);

    const { pharmacyId, medicineId, quantity, price, discount } = stock;

    
    const pharmacyName = pharmacyId ? pharmacyId.pharmacyName : "N/A";  

    const medicineName = medicineId ? medicineId.name : "N/A";
    let medicineComposition = "N/A";
    if (medicineId) {
        const comp1 = medicineId.short_composition1?.trim();
        const comp2 = medicineId.short_composition2?.trim();
        if (comp1 && comp2) {
            medicineComposition = `${comp1}, ${comp2}`;
        } else if (comp1) {
            medicineComposition = comp1;
        } else if (comp2) {
            medicineComposition = comp2;
        }
    }
    const medicineManufacturer = medicineId ? medicineId.manufacturer : "N/A";
    const medicinePrice = medicineId ? medicineId.price : "N/A";

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                >
                    <Eye size={18} />
                </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-lg max-h-[90vh] rounded-lg shadow-lg bg-white dark:bg-gray-950 flex flex-col">
                <DialogHeader className="p-5 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Stock Details
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Here are the details of the selected stock.
                    </DialogDescription>
                </DialogHeader>

                <div className="bg-gray-100 dark:bg-gray-950 rounded-lg p-6 space-y-4 overflow-y-auto flex-1">
                    {/* Stock Information */}
                    <InfoField label="Pharmacy Name" value={pharmacyName} />
                    <InfoField label="Medicine Name" value={medicineName} />
                    <InfoField label="Composition" value={medicineComposition} />
                    <InfoField label="Manufacturer" value={medicineManufacturer} />
                    <InfoField label="Medicine Price" value={medicinePrice} />
                    <InfoField label="Quantity" value={quantity} />
                    <InfoField label="Stock Price" value={price} />
                    <InfoField label="Discount" value={discount} />
                </div>

                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
                    <Button className="w-full" onClick={() => setOpen(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
