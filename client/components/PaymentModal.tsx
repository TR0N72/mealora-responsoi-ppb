import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Copy, CreditCard, Wallet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    totalPrice: number;
    onConfirm: () => void;
    loading: boolean;
}

export default function PaymentModal({
    open,
    onOpenChange,
    totalPrice,
    onConfirm,
    loading,
}: PaymentModalProps) {
    const { toast } = useToast();
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    const formatPrice = (price: number) => {
        return `Rp ${(price / 1000).toLocaleString("id-ID")}K`;
    };

    const banks = [
        {
            id: "bca",
            name: "BCA",
            number: "123 456 7890",
            holder: "PT Mealora Indonesia",
            icon: CreditCard,
            color: "bg-blue-600",
        },
        {
            id: "mandiri",
            name: "Mandiri",
            number: "098 765 4321",
            holder: "PT Mealora Indonesia",
            icon: CreditCard,
            color: "bg-yellow-600",
        },
        {
            id: "bri",
            name: "BRI",
            number: "1122 3344 5566",
            holder: "PT Mealora Indonesia",
            icon: CreditCard,
            color: "bg-blue-800",
        },
        {
            id: "gopay",
            name: "GoPay / OVO",
            number: "0812 3456 7890",
            holder: "Mealora Official",
            icon: Wallet,
            color: "bg-green-600",
        },
    ];

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: "Copied!",
            description: "Account number copied to clipboard.",
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white rounded-[25px]">
                <DialogHeader>
                    <DialogTitle className="font-modak text-2xl text-center">Payment Details</DialogTitle>
                    <DialogDescription className="text-center font-arial-rounded">
                        Complete your payment to proceed
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="bg-gray-50 p-4 rounded-xl mb-6 text-center">
                        <p className="text-sm text-gray-500 font-arial-rounded mb-1">Total Amount</p>
                        <p className="text-3xl font-bold text-[#FF7A00] font-arial-rounded">
                            {formatPrice(totalPrice)}
                        </p>
                    </div>

                    <p className="text-sm font-medium mb-3 font-arial-rounded">Select Payment Method:</p>
                    <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                        {banks.map((bank) => (
                            <div
                                key={bank.id}
                                onClick={() => setSelectedBank(bank.id)}
                                className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${selectedBank === bank.id
                                        ? "border-black bg-black/5 ring-1 ring-black"
                                        : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full ${bank.color} flex items-center justify-center text-white mr-3`}>
                                    <bank.icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm">{bank.name}</p>
                                    <p className="text-xs text-gray-500">{bank.holder}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono text-sm">{bank.number}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-2"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCopy(bank.number);
                                    }}
                                >
                                    <Copy size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Button
                        onClick={onConfirm}
                        disabled={loading || !selectedBank}
                        className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg font-arial-rounded"
                    >
                        {loading ? "Processing..." : "Confirm Payment"}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="w-full rounded-full py-6 text-lg font-arial-rounded border-black text-black hover:bg-gray-50"
                    >
                        Cancel
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
