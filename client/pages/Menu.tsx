import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItem from "@/components/MenuItem";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

interface MenuItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  dietary_tags?: string[];
  imageRotation?: boolean; // This might not be in DB, can handle logic or ignore
  bgColor?: string; // Same here
}

export default function Menu() {
  const { data: menuItems, isLoading, error } = useQuery<MenuItemData[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      const response = await fetch('/api/v1/menu');
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-red-500">Error loading menu. Please try again later.</p>
      </div>
    );
  }

  const mealSetItems = menuItems?.filter(item => item.category === "Meal Set") || [];
  const snackSetItems = menuItems?.filter(item => item.category === "Snack Set") || [];

  const formatPrice = (price: number) => {
    return `Rp ${(price / 1000).toLocaleString('id-ID')}K`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16 px-4">
        <section className="max-w-[1291px] mx-auto mb-16 md:mb-24">
          <h2 className="font-modak text-[32px] md:text-[40px] leading-none text-center text-black mb-4 md:mb-6">
            "Meal Set"
          </h2>
          <p className="font-arial-rounded text-base md:text-xl text-center text-black mb-12 md:mb-16 max-w-[836px] mx-auto">
            A "Meal Set" menu at MealorA is a carefully curated selection of dishes designed to offer a complete dining experience. Each meal set includes a variety of courses that complement each other, providing a balanced and satisfying meal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 md:gap-y-24">
            {mealSetItems.map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                price={formatPrice(item.price)}
                image={item.image}
                imageRotation={false} // Default or logic based on item
                discount={item.dietary_tags?.[0]} // Using dietary_tags for discount text for now
              />
            ))}
          </div>
        </section>

        <section className="max-w-[1273px] mx-auto">
          <h2 className="font-modak text-[32px] md:text-[40px] leading-none text-center text-black mb-4 md:mb-6">
            "Snack Set"
          </h2>
          <p className="font-arial-rounded text-base md:text-xl text-center text-black mb-12 md:mb-16 max-w-[836px] mx-auto">
            A "Snack Set" menu at MealorA is a carefully selected assortment of both traditional Indonesian and popular non-Indonesian snacks. This mix provides a delightful variety of flavors and textures, perfect for any casual gathering, meeting, or event.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 md:gap-y-16">
            {snackSetItems.map((item) => (
              <MenuItem
                key={item.id}
                name={item.name}
                price={formatPrice(item.price)}
                image={item.image}
                bgColor="#FF7A00" // Default for snacks
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
