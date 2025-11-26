import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          <h1 className="font-modak text-[80px] md:text-[120px] leading-tight text-black mb-4">
            404
          </h1>
          <p className="font-arial-rounded text-2xl md:text-3xl text-black mb-8">
            Oops! This page doesn't exist
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-black text-white font-arial-rounded text-[15px] md:text-[17px] rounded-full hover:bg-black/90 transition-colors"
          >
            BACK TO HOME
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
