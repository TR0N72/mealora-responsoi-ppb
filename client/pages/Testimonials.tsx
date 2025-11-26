import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestimonialCard from "@/components/TestimonialCard";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Rayya",
      testimonial:
        "We used MealorA's services for a family reunion, and it was a great choice. The food is fresh, flavorful, and beautifully presented",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/7a2844f975573fbed612bd5582d7395edb260de1?width=560",
      bgColor: "#CFFD3B",
    },
    {
      name: "Rafi",
      testimonial:
        "Best catering so far. Well seasoning and good price btw. I highly recommend this",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/5a118f82b5a4e351c8cb82b8f1e7279d45233c3c?width=560",
      bgColor: "#FF7A00",
    },
    {
      name: "Dilla",
      testimonial:
        "MealorA catered our company's annual party, and we couldn't be more pleased. The quality and taste of the food were exceptional",
      image:
        "https://api.builder.io/api/v1/image/assets/TEMP/4b914cf3ad95389f08e531c1bb87a1078a1abdf6?width=560",
      bgColor: "#CFFD3B",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="py-12 md:py-16 px-4">
        <h1 className="font-modak text-[48px] md:text-[64px] leading-tight text-center text-black mb-12 md:mb-16">
          "Testimonials"
        </h1>

        <div className="max-w-[1361px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              name={testimonial.name}
              testimonial={testimonial.testimonial}
              image={testimonial.image}
              bgColor={testimonial.bgColor}
            />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
