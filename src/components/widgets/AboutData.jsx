import React from 'react'
import { HeroHeading } from '../ui/Heading'

const AboutData = () => {
  return (
    <div data-aos="zoom-out">
    <span className="text-pink-600 font-semibold tracking-wide">
      About Aroma Follower
    </span>
{/* 
    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-3 mb-6 leading-tight">
      Where Flowers, Gifts <br /> & Cakes Create Memories
    </h2> */}
 <HeroHeading text1="Where Flowers, Gifts" text2="& Cakes Create Memories"/>
    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
      Aroma Follower brings you premium flower bouquets, elegant gift
      arrangements and delicious cakes to make every moment special.
      Whether it’s love, celebration or surprise — we deliver emotions.
    </p>

    <p className="text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
      From birthdays to anniversaries, our handcrafted designs and
      same-day delivery ensure happiness at your doorstep.
    </p>

    {/* STATS */}
    <div className="flex gap-12">
      <div>
        <h3 className="text-4xl font-bold text-pink-600">10+</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          Years Experience
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-bold text-pink-600">5k+</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          Happy Customers
        </p>
      </div>

      <div>
        <h3 className="text-4xl font-bold text-pink-600">100%</h3>
        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
          Fresh Products
        </p>
      </div>
    </div>
  </div>  )
}

export default AboutData