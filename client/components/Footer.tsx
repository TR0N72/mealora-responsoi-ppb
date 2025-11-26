import { Link, useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();
  return (
    <footer className="w-full bg-black text-white py-12 md:py-16 px-4">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div>
          <h2 className="font-modak text-[32px] md:text-[40px] leading-none mb-4 md:mb-6">
            MealorA
          </h2>
          <p className="font-arial-rounded text-[14px] md:text-[15px] leading-6 text-justify">
            CAteriNgz is a homemade culinary that has become a go-to for great
            food at events in JABODETABEK. Our journey began in a small kitchen,
            and now we're known for creating delicious experiences at all kinds
            of gatherings.
          </p>
        </div>

        <div>
          <h3 className="font-arial-rounded text-[14px] md:text-[15px] leading-6 text-[#B0B0B0] mb-2">
            Information
          </h3>
          <ul className="space-y-1">
            <li>
              <Link
                to="/about"
                className={`font-arial-rounded text-[14px] md:text-[15px] leading-6 transition-colors ${
                  location.pathname === "/about"
                    ? "text-white/50"
                    : "text-white hover:text-white/70"
                }`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/testimonials"
                className={`font-arial-rounded text-[14px] md:text-[15px] leading-6 transition-colors ${
                  location.pathname === "/testimonials"
                    ? "text-white/50"
                    : "text-white hover:text-white/70"
                }`}
              >
                Testimonial
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-arial-rounded text-[14px] md:text-[15px] leading-6 text-[#B0B0B0] mb-2">
            Contact Us
          </h3>
          <ul className="space-y-1">
            <li className="font-arial-rounded text-[14px] md:text-[15px] leading-6">
              Phone: +62 888 666 777 555
            </li>
            <li className="font-arial-rounded text-[14px] md:text-[15px] leading-6 break-all">
              Email: CAtriNgsfood@gmail.com
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
