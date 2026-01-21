'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ImageGrid from '../widgets/ImageGrid';
import AboutData from '../widgets/AboutData';

export default function AboutAromaFollower() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  return (
    <section className="py-10 bg-white dark:bg-zinc-900">
      <main className="w-[85%] mx-auto mt-20 text-gray-900 font-sans ">
        <div className="container mx-auto py-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
            {/* Image Grid */}
            <div className=" w-[100%]  ml-2 xl:ml-7 mb-3 lg:mb-0">
              <ImageGrid />
            </div>
            <AboutData />
          </div>
        </div>
      </main>
    </section>
  );
}
