import { useEffect, useRef, useState } from "react";

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
}

const ScrollSparkles = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const timeouts = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (mediaQuery.matches) {
      return;
    }

    let sparkleId = 0;

    const removeSparkle = (id: number, timeoutId: number) => {
      timeouts.current.delete(timeoutId);
      setSparkles((prev) => prev.filter((sparkle) => sparkle.id !== id));
    };

    const createSparkle = (x: number, y: number) => {
      const newSparkle: Sparkle = {
        id: sparkleId++,
        x,
        y,
        size: Math.random() * 16 + 8,
      };

      setSparkles((prev) => [...prev, newSparkle]);

      const timeoutId = window.setTimeout(() => {
        removeSparkle(newSparkle.id, timeoutId);
      }, 1500);

      timeouts.current.add(timeoutId);
    };

    const handleScroll = () => {
      const sparkleCount = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < sparkleCount; i += 1) {
        const x = Math.random() * window.innerWidth;
        const y = window.scrollY + Math.random() * window.innerHeight;
        createSparkle(x, y);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
        timeouts.current.clear();
        setSparkles([]);
        window.removeEventListener("scroll", handleScroll);
      } else {
        window.addEventListener("scroll", handleScroll, { passive: true });
      }
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handlePreferenceChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handlePreferenceChange);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handlePreferenceChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handlePreferenceChange);
      }

      timeouts.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeouts.current.clear();
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-50">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-fade-in"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            width: sparkle.size,
            height: sparkle.size,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="hsl(var(--primary))"
              className="opacity-80"
            />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default ScrollSparkles;

