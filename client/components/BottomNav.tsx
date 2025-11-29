import { Link, useLocation } from "react-router-dom";
import { Home, UtensilsCrossed, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
    const location = useLocation();

    const navItems = [
        { icon: Home, label: "Home", path: "/" },
        { icon: UtensilsCrossed, label: "Menu", path: "/menu" },
        { icon: ShoppingCart, label: "Cart", path: "/cart" },
        { icon: User, label: "Profile", path: "/profile" },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 md:hidden z-50 pb-safe">
            <div className="flex justify-around items-center">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={cn(
                                "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                                isActive ? "text-black" : "text-gray-400 hover:text-gray-600"
                            )}
                        >
                            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
