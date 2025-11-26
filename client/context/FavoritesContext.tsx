import React, { createContext, useContext, useState, useEffect } from 'react';

export interface FavoriteItem {
    id: string; // Ideally use ID, but MenuItem currently uses name/price/image. Let's try to use ID if available, or fallback to name.
    // Actually, MenuItem props don't include ID yet. I should update MenuItem to accept ID.
    // For now, let's store the whole item props needed for display.
    name: string;
    price: string;
    image: string;
    category?: string;
    dietary_tags?: string[];
}

interface FavoritesContextType {
    favorites: FavoriteItem[];
    addToFavorites: (item: FavoriteItem) => void;
    removeFromFavorites: (name: string) => void;
    isFavorite: (name: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }, [favorites]);

    const addToFavorites = (item: FavoriteItem) => {
        setFavorites((prev) => {
            if (prev.some((i) => i.name === item.name)) return prev;
            return [...prev, item];
        });
    };

    const removeFromFavorites = (name: string) => {
        setFavorites((prev) => prev.filter((item) => item.name !== name));
    };

    const isFavorite = (name: string) => {
        return favorites.some((item) => item.name === name);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}
