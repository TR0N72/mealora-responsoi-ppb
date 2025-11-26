import { Heart, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useFavorites } from "@/context/FavoritesContext";

interface MenuItemProps {
  id?: string;
  name: string;
  price: string;
  image: string;
  imageRotation?: boolean;
  discount?: string;
  bgColor?: string;
}

export default function MenuItem({
  id,
  name,
  price,
  image,
  imageRotation = false,
  discount,
  bgColor = "#CFFD3B"
}: MenuItemProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const isLiked = isFavorite(name);

  const handleAddToCart = () => {
    addToCart({ name, price, image });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  const toggleLike = () => {
    if (isLiked) {
      removeFromFavorites(name);
      toast({ title: "Removed from favorites", description: `${name} removed.` });
    } else {
      addToFavorites({ id: id || name, name, price, image });
      toast({ title: "Added to favorites", description: `${name} saved.` });
    }
  };

  return (
    <div className="relative w-full max-w-[358px] mx-auto">
      {discount && (
        <div className="absolute -top-4 -right-4 z-10">
          <svg
            className="w-24 h-24 md:w-[100px] md:h-[100px]"
            viewBox="0 0 94 94"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44.7805 1.25422C45.4525 -0.418112 47.82 -0.418108 48.492 1.25423L56.073 20.1193C56.4911 21.1596 57.6825 21.6531 58.7137 21.2131L77.4139 13.2341C79.0717 12.5268 80.7457 14.2008 80.0384 15.8585L72.0593 34.5588C71.6193 35.59 72.1128 36.7814 73.1531 37.1994L92.0182 44.7805C93.6906 45.4525 93.6906 47.82 92.0182 48.492L73.1531 56.073C72.1128 56.4911 71.6193 57.6825 72.0593 58.7137L80.0384 77.4139C80.7457 79.0717 79.0716 80.7457 77.4139 80.0384L58.7137 72.0593C57.6825 71.6193 56.4911 72.1128 56.073 73.1531L48.492 92.0182C47.82 93.6906 45.4525 93.6906 44.7805 92.0182L37.1994 73.1531C36.7814 72.1128 35.59 71.6193 34.5588 72.0593L15.8585 80.0384C14.2008 80.7457 12.5268 79.0716 13.2341 77.4139L21.2131 58.7137C21.6531 57.6825 21.1596 56.4911 20.1193 56.073L1.25422 48.492C-0.418112 47.82 -0.418108 45.4525 1.25423 44.7805L20.1193 37.1994C21.1596 36.7814 21.6531 35.59 21.2131 34.5588L13.2341 15.8585C12.5268 14.2008 14.2008 12.5268 15.8585 13.2341L34.5588 21.2131C35.59 21.6531 36.7814 21.1596 37.1994 20.1193L44.7805 1.25422Z"
              fill="#B600D4"
            />
          </svg>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-modak text-2xl text-white rotate-[23deg]">
            {discount}
          </span>
        </div>
      )}

      <div className="relative">
        <div className="w-full border border-black rounded-t-[25px] bg-white py-2">
          <h3 className="font-arial-rounded text-2xl text-center text-black px-4">
            {name}
          </h3>
        </div>

        <div
          className="w-full border-x border-black overflow-hidden flex items-center justify-center pt-6 pb-3"
          style={{ backgroundColor: bgColor }}
        >
          <img
            src={image}
            alt={name}
            className={`w-auto max-w-full h-[175px] object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)] transition-transform duration-300 hover:scale-110 ${imageRotation ? "rotate-12" : ""
              }`}
          />
        </div>

        <div className="w-full border border-black rounded-b-[25px] bg-white py-2 px-4 flex items-center justify-between">
          <span className="font-arial-rounded text-2xl text-black">
            {price}
          </span>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={toggleLike}
              className="w-7 h-7 rounded-full bg-[#D9D9D9] hover:bg-[#C0C0C0] transition-colors flex items-center justify-center border border-black/10"
              aria-label="Like"
            >
              <Heart
                size={16}
                className={isLiked ? "fill-red-500 stroke-red-500" : "fill-[#D9D9D9] stroke-black"}
                strokeWidth={1}
              />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-7 h-7 rounded-full bg-black flex items-center justify-center hover:bg-black/80 transition-colors"
              aria-label="Add to cart"
            >
              <Plus size={16} className="text-white" strokeWidth={4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
