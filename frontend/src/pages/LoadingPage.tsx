import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoadingPage = () => {
  const navigate = useNavigate();
  const letters = ["Z", "E", "N", "S", "T", "E", "E"];
  const [visibleLetters, setVisibleLetters] = useState<number[]>([]);

  useEffect(() => {
    letters.forEach((_, index) => {
      setTimeout(() => {
        setVisibleLetters((prev) => [...prev, index]);
      }, index * 150);
    });

    setTimeout(() => {
      navigate("/home");
    }, letters.length * 150 + 1000);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-2 sm:px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Responsive text layout with proper wrapping */}
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 md:gap-3">
          {letters.map((letter, index) => (
            <span
              key={index}
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-black transition-all duration-500 ${visibleLetters.includes(index)
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
                } text-glow-red text-foreground`}
              style={{
                animationDelay: `${index * 150}ms`,
                minWidth: letter === "." ? "6px" : "auto",
                lineHeight: "1"
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Loading indicator */}
        <div className="mt-6 sm:mt-8 md:mt-12 flex justify-center">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>

        {/* Progress text */}
        <div className="mt-4 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Loading your experience...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
