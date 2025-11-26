import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, ShoppingCart, LogOut, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { totalItems } = useCart();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // We might want to add an event listener for storage changes here
    // so that logging in/out in other tabs updates this one.
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('token');
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate("/auth");
  };

  return (
    <header className="w-full max-w-[1273px] mx-auto px-4 pt-5 pb-6">
      <div className="text-center mb-4">
        <h1 className="font-modak text-[32px] md:text-[40px] leading-none text-black">
          MealorA
        </h1>
      </div>

      <nav className="relative border border-black rounded-[17px] px-3 md:px-6 py-2 flex items-center justify-center md:justify-between">
        <div className="flex items-center gap-3 md:gap-8 flex-wrap justify-center md:mx-auto">
          <Link
            to="/"
            className={`font-arial-rounded text-sm md:text-xl transition-colors whitespace-nowrap ${location.pathname === "/" ? "text-black/50" : "text-black hover:text-black/70"
              }`}
          >
            Home
          </Link>
          <Link
            to="/menu"
            className={`font-arial-rounded text-sm md:text-xl transition-colors whitespace-nowrap ${location.pathname === "/menu" ? "text-black/50" : "text-black hover:text-black/70"
              }`}
          >
            Our Menu
          </Link>
          <Link
            to="/about"
            className={`font-arial-rounded text-sm md:text-xl transition-colors whitespace-nowrap ${location.pathname === "/about" ? "text-black/50" : "text-black hover:text-black/70"
              }`}
          >
            About
          </Link>
          <Link
            to="/testimonials"
            className={`font-arial-rounded text-sm md:text-xl transition-colors whitespace-nowrap ${location.pathname === "/testimonials" ? "text-black/50" : "text-black hover:text-black/70"
              }`}
          >
            Testimonials
          </Link>
          {localStorage.getItem('role') === 'admin' && (
            <Link
              to="/admin"
              className={`font-arial-rounded text-sm md:text-xl transition-colors whitespace-nowrap ${location.pathname === "/admin" ? "text-black/50" : "text-black hover:text-black/70"
                }`}
            >
              Admin
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 absolute right-6">
          <Link to={isLoggedIn ? "/profile" : "/auth"} className="text-black hover:text-black/70 transition-colors" aria-label="User account">
            <User size={20} />
          </Link>
          <Link to="/favorites" className="text-black hover:text-black/70 transition-colors" aria-label="Favorites">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="font-arial-rounded text-xl text-black hover:text-black/70 transition-colors flex items-center gap-2 relative">
            <ShoppingCart size={20} />
            Cart
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF7A00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {isLoggedIn && (
            <button onClick={handleLogout} className="text-black hover:text-black/70 transition-colors" aria-label="Logout">
              <LogOut size={20} />
            </button>
          )}
        </div>
      </nav>

      <div className="flex md:hidden items-center justify-center gap-4 mt-3">
        <Link to={isLoggedIn ? "/profile" : "/auth"} className="text-black hover:text-black/70 transition-colors" aria-label="User account">
          <User size={18} />
        </Link>
        <Link to="/favorites" className="text-black hover:text-black/70 transition-colors" aria-label="Favorites">
          <Heart size={18} />
        </Link>
        <Link to="/cart" className="font-arial-rounded text-lg text-black hover:text-black/70 transition-colors flex items-center gap-2 relative">
          <ShoppingCart size={18} />
          Cart
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF7A00] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Link>
        {isLoggedIn && (
          <button onClick={handleLogout} className="text-black hover:text-black/70 transition-colors" aria-label="Logout">
            <LogOut size={18} />
          </button>
        )}
      </div>
    </header>
  );
}
