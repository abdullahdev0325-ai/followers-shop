'use client';

import Link from 'next/link';
import { LoginHeading } from '../ui/Heading';

export default function HotDeals() {
  return (
    <section className="py-16 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-gradient-to-r from-red-50 to-pink-50 dark:from-zinc-800 dark:to-zinc-900 rounded-lg p-8">
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-900 dark:to-green-800 rounded-lg flex items-center justify-center text-8xl">
              🎄
            </div>
          </div>
          <div>
            <LoginHeading text="Hurry Up! Grab the best deals before they are gone!" />
            <Link
              href="/products"
 className="w-[30%] py-3 mt-10 rounded-xl bg-gradient-to-r from-red-600 to-pink-600 hover:from-pink-600 hover:to-red-600 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-pink-500/40 flex items-center justify-center disabled:opacity-60"     
        >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}


