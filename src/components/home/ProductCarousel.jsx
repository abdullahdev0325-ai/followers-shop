'use client';

import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import AOS from 'aos';
import ProductCard from '../widgets/ProductCard';
import 'aos/dist/aos.css';
import { HeroHeading, LoginHeading } from '../ui/Heading';


export default function ProductCarousel({ title, products = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleCards = 4;
  const maxIndex = Math.max(0, products.length - visibleCards);

  useEffect(() => {
    AOS.init({
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-zinc-900" data-aos="fade-up">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <LoginHeading text={title} />

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentIndex((p) => Math.max(p - 1, 0))}
              disabled={currentIndex === 0}
              className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 dark:bg-zinc-800 disabled:opacity-40"
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={() => setCurrentIndex((p) => Math.min(p + 1, maxIndex))}
              disabled={currentIndex === maxIndex}
              className="p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 dark:bg-zinc-800 disabled:opacity-40"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products
            .slice(currentIndex, currentIndex + visibleCards)
            .map((product, index) => (
              <div key={`${product.slug}-${currentIndex + index}`} 
               data-aos-duration={index * 100}
               > 

                <ProductCard
                  product={product}
                  aosDelay={index * 120}
                />
               </div>
            ))}
        </div>
      </div>
    </section>
  );
}
