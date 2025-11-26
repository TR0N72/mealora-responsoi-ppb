interface TestimonialCardProps {
  name: string;
  testimonial: string;
  image: string;
  bgColor?: string;
}

export default function TestimonialCard({
  name,
  testimonial,
  image,
  bgColor = "#CFFD3B",
}: TestimonialCardProps) {
  return (
    <div
      className="w-full max-w-[351px] mx-auto rounded-[27px] p-9 flex flex-col"
      style={{ backgroundColor: bgColor }}
    >
      <img
        src="https://api.builder.io/api/v1/image/assets/TEMP/01bc55c87febde3bcbb98e277cd94d6d0467b2ac?width=560"
        alt="Testimony"
        className="w-full h-11 object-contain mb-6"
      />

      <img
        src={image}
        alt={name}
        className="w-full h-auto rounded-[18px] mb-6"
        style={{ aspectRatio: "280/344" }}
      />

      <p className="font-arial-rounded text-lg text-justify text-black opacity-50 mb-6 min-h-[63px]">
        "{testimonial}"
      </p>

      <div className="flex items-center gap-2 opacity-50">
        <span className="font-arial-rounded text-lg text-black">{name} -</span>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
            >
              <path
                d="M11.5879 2.70289C11.8643 1.85213 13.0679 1.85213 13.3443 2.70289L15.0576 7.97582C15.1812 8.35628 15.5358 8.61388 15.9358 8.61388L21.4801 8.61388C22.3747 8.61388 22.7466 9.75856 22.0229 10.2844L17.5375 13.5432C17.2138 13.7783 17.0784 14.1952 17.202 14.5756L18.9153 19.8485C19.1917 20.6993 18.218 21.4068 17.4943 20.881L13.0089 17.6221C12.6853 17.387 12.247 17.387 11.9234 17.6221L7.43793 20.881C6.71424 21.4068 5.74052 20.6993 6.01694 19.8485L7.73022 14.5756C7.85384 14.1952 7.71842 13.7783 7.39477 13.5432L2.90935 10.2844C2.18565 9.75856 2.55758 8.61388 3.45212 8.61388L8.9964 8.61388C9.39645 8.61388 9.75101 8.35628 9.87463 7.97582L11.5879 2.70289Z"
                fill="white"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
}
