import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import LazyImage from "./LazyImage";

const slides = [
  {
    id: 1,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0e25bcfddc22119b2f854e45d6d7515cd63848dc?width=2546",
    alt: "Delicious meal prep containers"
  },
  {
    id: 2,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0e25bcfddc22119b2f854e45d6d7515cd63848dc?width=2546",
    alt: "Fresh ingredients"
  },
  {
    id: 3,
    image: "https://api.builder.io/api/v1/image/assets/TEMP/0e25bcfddc22119b2f854e45d6d7515cd63848dc?width=2546",
    alt: "Catering setup"
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
