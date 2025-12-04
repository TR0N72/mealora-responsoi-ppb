import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MenuItem from "@/components/MenuItem";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItemData {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  dietary_tags?: string[];
  imageRotation?: boolean;
  bgColor?: string;
}

interface MenuResponse {
  data: MenuItemData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function Menu() {
  const [category, setCategory] = useState<"Meal Set" | "Snack Set">("Meal Set");
  const [page, setPage] = useState(1);

  const { data: menuData, isLoading, error } = useQuery<MenuResponse>({
    queryKey: ['menu', category, page],
    queryFn: async () => {
      const response = await fetch(`/api/v1/menu?category=${encodeURIComponent(category)}&page=${page}&limit=6`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu');
      }
      return response.json();
    },
  });

  const handleCategoryChange = (newCategory: "Meal Set" | "Snack Set") => {
    setCategory(newCategory);
    setPage(1); // Reset to first page when category changes
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatPrice = (price: number) => {
    return `Rp ${(price / 1000).toLocaleString('id-ID')}K`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16 px-4">
        <div className="max-w-[1291px] mx-auto">
          {/* Category Selection */}
          <div className="flex justify-center gap-4 mb-12">
            <Button
              onClick={() => handleCategoryChange("Meal Set")}
              className={cn(
                "px-8 py-6 text-xl rounded-full transition-all duration-300",
                category === "Meal Set"
                  ? "bg-black text-white hover:bg-black/90"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              )}
            >
              Meal Set
            </Button>
            <Button
              onClick={() => handleCategoryChange("Snack Set")}
              className={cn(
                "px-8 py-6 text-xl rounded-full transition-all duration-300",
                category === "Snack Set"
                  ? "bg-[#FF7A00] text-white hover:bg-[#FF7A00]/90"
                  : "bg-gray-100 text-black hover:bg-gray-200"
              )}
            >
              Snack Set
            </Button>
          </div>

          <section className="mb-16 md:mb-24">
            <h2 className="font-modak text-[32px] md:text-[40px] leading-none text-center text-black mb-4 md:mb-6">
              "{category}"
            </h2>
            <p className="font-arial-rounded text-base md:text-xl text-center text-black mb-12 md:mb-16 max-w-[836px] mx-auto">
              {category === "Meal Set"
                ? 'A "Meal Set" menu at MealorA is a carefully curated selection of dishes designed to offer a complete dining experience. Each meal set includes a variety of courses that complement each other, providing a balanced and satisfying meal.'
                : 'A "Snack Set" menu at MealorA is a carefully selected assortment of both traditional Indonesian and popular non-Indonesian snacks. This mix provides a delightful variety of flavors and textures, perfect for any casual gathering, meeting, or event.'
              }
            </p>

            {isLoading ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-black" />
              </div>
            ) : error ? (
              <div className="min-h-[400px] flex items-center justify-center">
                <p className="text-red-500">Error loading menu. Please try again later.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20 md:gap-y-24 mb-16">
                  {menuData?.data.map((item) => (
                    <MenuItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={formatPrice(item.price)}
                      image={item.image}
                      imageRotation={category === "Meal Set" ? false : undefined}
                      bgColor={category === "Snack Set" ? "#FF7A00" : undefined}
                      discount={item.dietary_tags?.[0]}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {menuData?.pagination && menuData.pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="rounded-full w-12 h-12"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <span className="text-lg font-medium">
                      Page {page} of {menuData.pagination.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === menuData.pagination.totalPages}
                      className="rounded-full w-12 h-12"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
