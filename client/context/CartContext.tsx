import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
    name: string;
    price: string; // e.g., "Rp 38K"
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, 'quantity'>) => void;
    removeFromCart: (name: string) => void;
    updateQuantity: (name: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(current => {
            const existing = current.find(item => item.name === newItem.name);
            if (existing) {
                return current.map(item =>
                    item.name === newItem.name
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...current, { ...newItem, quantity: 1 }];
        });
    };

    const removeFromCart = (name: string) => {
        setItems(current => current.filter(item => item.name !== name));
    };

    const updateQuantity = (name: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(name);
            return;
        }
        setItems(current =>
            current.map(item =>
                item.name === name ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setItems([]);

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce((sum, item) => {
        // Parse price string "Rp 38K" -> 38000
        const priceStr = item.price.replace(/[^0-9]/g, '');
        const price = parseInt(priceStr) * 1000; // Assuming "K" means thousands
        return sum + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{
            items,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
