import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import MealCard from "@/components/MealCard";

export default function Index() {
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
        
        <section className="py-12 md:py-16 px-4">
          <h2 className="font-modak text-[40px] md:text-[64px] leading-tight text-center text-black mb-8 md:mb-12 max-w-[745px] mx-auto stroke-black stroke-1">
            Weekly Recommendation
          </h2>

          <div className="max-w-[1309px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-12 md:mb-16">
            <MealCard
              name="Cashew Chicken"
              image="https://api.builder.io/api/v1/image/assets/TEMP/a0fdb78a3bc8f128fea48c348e6f0f008932f1a6?width=542"
              discount="20%"
            />
            <MealCard
              name="Soy Glazed Chicken"
              image="https://api.builder.io/api/v1/image/assets/TEMP/245de98dd49afeee793fa1fe150c3ec0a13100c8?width=377"
              imageRotation={true}
            />
            <MealCard
              name="Parmesan Kale Pasta"
              image="https://api.builder.io/api/v1/image/assets/TEMP/3360c98403f97e6f769348e00625840135fde72c?width=363"
              imageRotation={true}
            />
          </div>

          <div className="flex justify-center">
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
