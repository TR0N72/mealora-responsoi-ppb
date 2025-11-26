import LazyImage from "./LazyImage";

interface MealCardProps {
  name: string;
  image: string;
  imageRotation?: boolean;
  discount?: string;
}

export default function MealCard({ name, image, imageRotation = false, discount }: MealCardProps) {
  return (
    <div className="relative flex flex-col items-center w-full max-w-[358px] mx-auto">
      {discount && (
        <div className="absolute -top-4 -right-4 z-10">
          <svg
            className="w-20 h-20 md:w-24 md:h-24"
            viewBox="0 0 94 93"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M44.748 1.24946C45.4224 -0.416509 47.7812 -0.416514 48.4556 1.24946L56.0377 19.9777C56.4569 21.0131 57.643 21.5045 58.6716 21.0689L77.3742 13.1478C79.0338 12.4449 80.7034 14.1234 79.9916 15.7792L72.0342 34.291C71.5898 35.3248 72.0854 36.5216 73.1306 36.9385L91.9447 44.4431C93.6233 45.1127 93.6233 47.4889 91.9446 48.1584L73.1306 55.6631C72.0854 56.08 71.5898 57.2768 72.0342 58.3106L79.9916 76.8223C80.7034 78.4781 79.0338 80.1567 77.3742 79.4538L58.6716 71.5327C57.643 71.0971 56.4569 71.5884 56.0377 72.6238L48.4556 91.3521C47.7812 93.0181 45.4224 93.0181 44.748 91.3521L37.1659 72.6238C36.7467 71.5884 35.5606 71.0971 34.5321 71.5327L15.8294 79.4538C14.1698 80.1567 12.5002 78.4781 13.212 76.8223L21.1694 58.3106C21.6138 57.2768 21.1182 56.08 20.073 55.6631L1.25896 48.1584C-0.419714 47.4888 -0.41971 45.1127 1.25896 44.4431L20.073 36.9385C21.1182 36.5216 21.6138 35.3248 21.1694 34.291L13.212 15.7792C12.5002 14.1234 14.1698 12.4449 15.8294 13.1478L34.5321 21.0689C35.5606 21.5045 36.7467 21.0132 37.1659 19.9777L44.748 1.24946Z"
              fill="#B600D4"
            />
          </svg>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-modak text-2xl text-white rotate-[23deg]">
            {discount}
          </span>
        </div>
      )}

      <div className="w-full border border-black rounded-[25px] bg-[#CFFD3B] pt-6 pb-3 overflow-hidden">
        <div className="flex items-center justify-center px-4">
          <LazyImage
            src={image}
            alt={name}
            className="w-auto max-w-full h-[175px] object-contain drop-shadow-[0_8px_4px_rgba(0,0,0,0.25)]"
          />
        </div>

        <div className="w-full border-t border-black bg-white rounded-b-[25px] py-3">
          <h3 className="font-arial-rounded text-2xl text-center text-black">
            {name}
          </h3>
        </div>
      </div>
    </div>
  );
}
