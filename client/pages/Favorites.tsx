import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItem from "@/components/MenuItem";
import { useFavorites } from "@/context/FavoritesContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Favorites() {
    const { favorites } = useFavorites();

    return (
        <div className="min-h-screen bg-white">
            <Header />

            <main className="py-12 md:py-16 px-4">
                <section className="max-w-[1291px] mx-auto">
                    <h2 className="font-modak text-[32px] md:text-[40px] leading-none text-center text-black mb-12 md:mb-16">
                        Your Favorites
                    </h2>

                    {favorites.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="font-arial-rounded text-xl text-gray-500 mb-6">
                                You haven't saved any items yet.
                            </p>
                            <Link to="/menu">
                                <Button className="bg-black text-white hover:bg-gray-800 rounded-full px-8 py-6 text-lg font-arial-rounded">
                                    Browse Menu
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 md:gap-y-24">
                            {favorites.map((item, index) => (
                                <MenuItem
                                    key={index}
                                    name={item.name}
                                    price={item.price}
                                    image={item.image}
                                // We might need to store these extra props in favorites too if we want them to persist perfectly
                                // For now, defaults will apply if missing
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
}
