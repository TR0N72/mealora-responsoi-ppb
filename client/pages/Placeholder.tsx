import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface PlaceholderProps {
  pageName: string;
}

export default function Placeholder({ pageName }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl">
          <h1 className="font-modak text-[48px] md:text-[64px] leading-tight text-black mb-6">
            {pageName}
          </h1>
          <p className="font-arial-rounded text-xl text-black mb-8">
            This page is currently under construction. Check back soon for delicious updates!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-10 py-5 bg-black text-white font-arial-rounded text-[17px] rounded-full hover:bg-black/90 transition-colors"
          >
            BACK TO HOME
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
