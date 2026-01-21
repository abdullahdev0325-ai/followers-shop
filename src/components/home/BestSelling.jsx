'use client';

import Link from 'next/link';

const bestSellingProducts = [
  { name: 'Red Rose Bouquet', price: 199, originalPrice: 249, image: '/images/follower.jpg', slug: 'red-rose-bouquet', sale: 20 },
  { name: 'Pink Tulip Bouquet', price: 179, image: '/images/follower.jpg', slug: 'pink-tulip-bouquet' },
  { name: 'White Lily Bouquet', price: 219, image: '/images/follower.jpg', slug: 'white-lily-bouquet' },
  { name: 'Mixed Flower Arrangement', price: 249, originalPrice: 299, image: '/images/follower.jpg', slug: 'mixed-flower-arrangement', sale: 20 },
  { name: 'Sunflower Bouquet', price: 189, image: '/images/follower.jpg', slug: 'sunflower-bouquet' },
  { name: 'Orchid Arrangement', price: 269, image: '/images/follower.jpg', slug: 'orchid-arrangement' },
  { name: 'Carnation Bouquet', price: 159, image: '/images/follower.jpg', slug: 'carnation-bouquet' },
  { name: 'Hydrangea Bouquet', price: 229, image: '/images/follower.jpg', slug: 'hydrangea-bouquet' },
  { name: 'Red & Pink Mix', price: 199, originalPrice: 249, image: '/images/follower.jpg', slug: 'red-pink-mix', sale: 20 },
  { name: 'White Rose Bouquet', price: 209, image: '/images/follower.jpg', slug: 'white-rose-bouquet' },
  { name: 'Lavender Bouquet', price: 189, image: '/images/follower.jpg', slug: 'lavender-bouquet' },
  { name: 'Peony Bouquet', price: 239, image: '/images/follower.jpg', slug: 'peony-bouquet' },
];

export default function BestSelling() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
          BEST SELLING
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {bestSellingProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group"
            >
              <div
                className="
                  bg-white dark:bg-zinc-800
                  rounded-xl overflow-hidden
                  shadow-sm hover:shadow-lg
                  transition-all duration-300
                "
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(e) =>
                      (e.currentTarget.src = '/images/follower.jpg')
                    }
                    className="
                      w-full h-40 object-cover
                      transition-transform duration-500
                      group-hover:scale-110
                    "
                  />

                  {/* SALE BADGE */}
                  {product.sale && (
                    <div
                      className="
                        absolute top-2 right-2
                        w-10 h-10
                        rounded-full
                        bg-pink-600
                        text-white
                        text-xs font-bold
                        flex items-center justify-center
                        shadow-lg
                      "
                    >
                      {product.sale}%
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className="text-pink-600 dark:text-pink-400 font-bold text-sm">
                      AED {product.price}
                    </span>

                    {product.originalPrice && (
                      <span className="text-gray-400 line-through text-xs">
                        AED {product.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
