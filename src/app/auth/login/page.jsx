// "use client"
// import Login from '@/components/auth/Login';
// import React from 'react';

// // export const metadata = {
// //   title: "Aroma Flowers - Login",
// //   description:
// //     "Login to Aroma Flowers to order fresh flowers, cakes, gifts, and party decorations with fast delivery across Dubai & UAE.",
// //   keywords: [
// //     "Aroma Flowers login",
// //     "flower delivery Dubai",
// //     "UAE flower shop",
// //     "login",
// //     "gifts",
// //     "cakes",
// //     "midnight delivery",
// //   ],
// //   openGraph: {
// //     title: "Aroma Flowers - Login",
// //     description:
// //       "Login to your Aroma Flowers account and enjoy fresh flowers and gifts delivery across Dubai & UAE.",
// //     type: "website",
// //   },
// // };

// const page = () => {
//   return <Login />;
// };

// export default page;

import Login from '@/components/auth/Login';

export const dynamic = 'force-dynamic';

export default function Page() {
  return <Login />;
}
