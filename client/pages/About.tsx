import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <section className="relative w-full bg-[#CFFD3B] overflow-hidden">
          <div className="relative w-full min-h-[400px] md:min-h-[566px] flex items-center justify-center py-12 md:py-16">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/080cf98b332c136dabeaecdc98238dd27761fb6c?width=542"
              alt="Cashew Chicken"
              className="absolute top-8 md:top-14 left-8 md:left-48 w-40 md:w-[271px] h-auto drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] hidden sm:block"
            />

            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/5233c82b90bb14f282688cd9f6492335bf45a43c?width=462"
              alt="Beef Lo Mein"
              className="absolute bottom-8 md:bottom-14 left-8 md:left-40 w-40 md:w-[231px] h-auto rotate-90 drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] hidden sm:block"
            />

            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/59f5f8930250bcbc1101f35e02d727967bb32afd?width=398"
              alt="Parmesan Kale Pasta"
              className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-36 md:w-[199px] h-auto -rotate-90 drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] hidden lg:block"
            />

            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/c69582c4f30578ef70d91bf2445b3ff2684bc82f?width=380"
              alt="Soy Glazed Chicken"
              className="absolute top-8 md:top-12 right-8 md:right-48 w-32 md:w-[190px] h-auto rotate-90 hidden sm:block"
            />

            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/3f6a3d9725874634e9ab24708eb64590295579ea?width=402"
              alt="Tso Chicken"
              className="absolute bottom-12 md:bottom-16 right-8 md:right-48 w-36 md:w-[201px] h-auto rotate-90 drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] hidden sm:block"
            />

            <h1 className="relative z-10 font-modak text-[48px] md:text-[64px] leading-tight text-center text-white stroke-black stroke-1">
              About Us
            </h1>
          </div>
        </section>

        <section className="py-12 md:py-16 px-4">
          <div className="max-w-[1228px] mx-auto">
            <p className="font-arial-rounded text-base md:text-xl leading-6 text-center text-black">
              MealorA is a homemade culinary that has become a go-to for great
              food at events in JABODETABEK. Our journey began in a small
              kitchen, and now we're known for creating delicious experiences at
              all kinds of gatherings. We're all about using the best
              ingredients. We get our stuff locally and use seasonal items to
              keep things fresh and sustainable. Our chefs work with local
              farmers and artisans to bring out the best flavors in every dish.
              Our commitment to excellence doesn't stop at the kitchen. We
              believe in providing an exceptional experience from the moment you
              contact us to the final bite of dessert. With our personalized
              approach and attention to detail, MealorA turns every event into a
              unique culinary celebration that reflects your vision and style.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
