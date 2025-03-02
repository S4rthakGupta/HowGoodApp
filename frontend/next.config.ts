// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**.googleusercontent.com", // Google Images
//       },
//       {
//         protocol: "https",
//         hostname: "**.serpapi.com", // SerpAPI Images
//       },
//       {
//         protocol: "https",
//         hostname: "**.thecarycompany.com", // Other external domains
//       },
//       {
//         protocol: "https",
//         hostname: "**.amazonaws.com", // (Optional) Add if images are served via AWS S3
//       },
//     ],
//     domains: [
//       "encrypted-tbn0.gstatic.com", // Google image thumbnails
//       "upload.wikimedia.org", // Wikipedia images
//       "cdn.shopify.com", // Shopify product images
//       "images.unsplash.com", // Unsplash images (backup)
//     ],
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "**.serpapi.com" },
      { protocol: "https", hostname: "**.thecarycompany.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.m.media-amazon.com" }, // ✅ Amazon images
      { protocol: "https", hostname: "**.cdn.shopify.com" }, // ✅ Shopify images
      { protocol: "https", hostname: "**.upload.wikimedia.org" }, // ✅ Wikipedia images
      { protocol: "https", hostname: "**.images.unsplash.com" }, // ✅ Unsplash
    ],
  },
};

module.exports = nextConfig;

