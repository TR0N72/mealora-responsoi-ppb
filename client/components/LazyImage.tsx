import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    placeholderSrc?: string;
}

export default function LazyImage({
    src,
    alt,
    className,
    placeholderSrc = "/placeholder.svg",
    ...props
}: LazyImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentSrc, setCurrentSrc] = useState(placeholderSrc);

    useEffect(() => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setCurrentSrc(src);
            setIsLoading(false);
        };

        img.onerror = () => {
            setError(true);
            setIsLoading(false);
        };
    }, [src]);

    return (
        <div className={cn("relative overflow-hidden", className)}>
            {isLoading && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            <img
                src={error ? placeholderSrc : currentSrc}
                alt={alt}
                className={cn(
                    "transition-opacity duration-500",
                    isLoading ? "opacity-0" : "opacity-100",
                    className
                )}
                loading="lazy"
                {...props}
            />
        </div>
    );
}
