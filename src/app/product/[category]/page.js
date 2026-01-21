import { notFound } from 'next/navigation';
import CategoryProducts from '@/components/products/CategoryProducts';

// Valid categories
const validCategories = [
  'gifts',
  'cakes',
  'flowers',
  'for-her',
  'for-him',
  'birthday',
  'anniversary',
  'love-romance',
  'wedding',
  'new-year',
  'valentine',
  'mothers-day',
  'fathers-day',
  'eid',
  'ramadan',
  'christmas',
];

// export async function generateMetadata({ params }) {
//   const { category } = await params;
//   const categoryName = category
//     .split('-')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');

//   return {
//     title: `${categoryName} - Aroma Flowers | Buy ${categoryName} Online in Dubai & UAE`,
//     description: `Shop ${categoryName} online in Dubai & UAE. Same-day delivery and midnight delivery available. Fresh ${categoryName} with best quality.`,
//     keywords: [categoryName.toLowerCase(), 'flowers', 'gifts', 'Dubai', 'UAE', 'same day delivery'],
//     openGraph: {
//       title: `${categoryName} - Aroma Flowers`,
//       description: `Shop ${categoryName} online in Dubai & UAE`,
//       type: 'website',
//     },
//   };
// }

export default async function CategoryPage({ params }) {
  const { category } = await params;

  // Check if valid category
  if (!validCategories.includes(category.toLowerCase())) {
    notFound();
  }

  return <CategoryProducts type="category" />;
}


