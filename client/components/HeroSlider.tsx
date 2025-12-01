import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "./LazyImage";

const slides = [
  {
    id: 1,
    image: "/assets/hero-slide-1.png",
    alt: "Big Deals! June 10 & 11 2024 only"
  },
  {
    id: 2,
    image: "/assets/hero-slide-2.png",
    alt: "Mealora healthy meal prep"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full max-w-[1273px] mx-auto px-4">
      <div className="relative aspect-[1273/765] rounded-[25px] overflow-hidden">
        <LazyImage
          src={slides[currentSlide].image}
          alt={slides[currentSlide].alt}
          className="w-full h-full object-cover"
        />

        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft size={48} strokeWidth={3} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white hover:text-white/70 transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight size={48} strokeWidth={3} />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentSlide
                ? "bg-white"
                : "bg-white/50"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
