"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HeroHeading } from "../ui/Heading";

function Counter( value ) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const increment = value / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return <span>{count.toLocaleString()}</span>;
}

export default function HomePage() {
  return (
    <main className="min-h-[80vh] flex items-center  justify-center py-0 px-6
      bg-[#f9f6f2] text-gray-900
      dark:bg-[#0f0f0f] dark:text-gray-100"
     style={{
  backgroundImage: "url(/images/bg.webp)",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
}}

      >

      <div className="max-w-6xl w-full grid md:grid-cols-2  gap-12 items-center">

        {/* TEXT */}
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-3">
            Fresh Collection
          </p>

          
          <HeroHeading text1="Where every petal" text2="tells a story of resilience" />
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
            Discover cake, gifts and followers services crafted to make every
            moment special.
          </p>

          {/* BUTTON */}
          <Link
            href="/products"
                           className="w-[50%] py-3 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60"

          >
            View Collection
          </Link>

        </div>

     

      </div>
    </main>
  );
}
