import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import MealCard from "@/components/MealCard";
import { Loader2 } from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  dietary_tags?: string[];
}

export default function Index() {
  const { data: menuItems, isLoading } = useQuery<MenuItem[]>({
    queryKey: ['menu'],
    queryFn: async () => {
      const response = await fetch('/api/v1/menu');
      if (!response.ok) {
        // If 404 (no items), return empty array
        if (response.status === 404) return [];
        throw new Error('Failed to fetch menu');
      }
      return response.json();
    },
  });

  // Duplicate items to create seamless loop
  const carouselItems = menuItems ? [...menuItems, ...menuItems, ...menuItems, ...menuItems] : [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="py-8">
          <HeroSlider />
        </section>

        <section className="py-12 md:py-16 px-4">
          <div className="max-w-[1273px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="font-modak text-[40px] md:text-[64px] leading-tight text-black mb-4 md:mb-6">
                MealorA
              </h2>
              <p className="font-arial-rounded text-base md:text-xl leading-6 text-justify text-black">
                MealorA is a homemade culinary that has become a go-to for great food at events in JABODETABEK. Our journey began in a small kitchen, and now we're known for creating delicious experiences at all kinds of gatherings. We're all about using the best ingredients. We get our stuff locally and use seasonal items to keep things fresh and sustainable. Our chefs work with local farmers and artisans to bring out the best flavors in every dish.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/a450ea2d8d30d5d5f37388191547ff7e16a9cfb5?width=1062"
                alt="MealorA food preparation"
                className="w-full max-w-[531px] h-auto rounded-[25px] object-cover"
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 overflow-hidden">
          <h2 className="font-modak text-[40px] md:text-[64px] leading-tight text-center text-black mb-8 md:mb-12 max-w-[745px] mx-auto stroke-black stroke-1">
            Weekly Recommendation
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : (
            <div className="relative w-full">
              <motion.div
                className="flex gap-8 lg:gap-12 w-max"
                animate={{ x: "-50%" }}
                transition={{
                  repeat: Infinity,
                  ease: "linear",
                  duration: 60,
                  repeatType: "loop"
                }}
              >
                {carouselItems.map((item, index) => {
                  // Find discount tag if any (e.g., "20% OFF")
                  const discountTag = item.dietary_tags?.find(tag => tag.includes('%'));

                  return (
                    <div key={`${item.id}-${index}`} className="w-[300px] md:w-[350px] flex-shrink-0">
                      <MealCard
                        name={item.name}
                        image={item.image}
                        discount={discountTag}
                        imageRotation={index % 2 !== 0}
                      />
                    </div>
                  );
                })}
              </motion.div>
            </div>
          )}

          <div className="flex justify-center mt-12 md:mt-16">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-black text-white font-arial-rounded text-[15px] md:text-[17px] rounded-full hover:bg-black/90 transition-colors"
            >
              EXPLORE MENU
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
