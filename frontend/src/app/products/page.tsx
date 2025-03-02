"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ProductsPage() {
    const { user } = useUser();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [aiProduct, setAiProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // **Fetch existing products from MongoDB**
    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();
    }, []);

    // **Handle Product Search & AI Analysis**
    const handleSearch = async () => {
        if (!search) return;
        setLoading(true);
        setAiProduct(null);
        setError("");

        // Check if the product exists in MongoDB first
        const existingProduct = products.find(
            (product: any) => product.name.toLowerCase() === search.toLowerCase()
        );

        if (existingProduct) {
            console.log(`✅ Product Found in Database: ${search}`);
            setLoading(false);
            return;
        }

        try {
            console.log(`🔍 Searching AI for product: ${search}`);

            // Fetch AI-generated product details
            const response = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ name: search }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                console.error("❌ API Error: Failed to fetch AI response", await response.text());
                throw new Error("AI Analysis Failed");
            }

            const data = await response.json();

            // **Ensure We Extract the AI Score Properly**
            let sustainabilityScore = 50; // Default to 50 if AI fails

            if (data && data.overallRating) {
                sustainabilityScore = data.overallRating; // ✅ Use the actual backend response!
            }

            // setAiProduct({
            //     name: search,
            //     description: data.description || "No description available.",
            //     rating: sustainabilityScore,
            //     factorRatings: data.factorRatings || {},
            //     image: data.image && data.image.startsWith("http") ? data.image : "/images/default.png",
            // });

            // console.log(`✅ AI Product Updated: ${search} - Score: ${sustainabilityScore}%`);


            setAiProduct({
                name: search,
                description: data.description || "No description available.", // ✅ Now uses AI-generated description
                rating: data.overallRating,
                factorRatings: data.factorRatings || {},
                image: data.image && data.image.startsWith("http") ? data.image : "/images/default.png",
            });


        } catch (err) {
            console.error("❌ AI Error:", err);
            setError("AI could not generate a response. Try another product.");
        }

        setLoading(false);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col">
                <p className="text-lg text-gray-600">🔒 Please log in to see product details.</p>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 flex flex-col">
            <NavBar />

            {/* Page Content */}
            <div className="flex-grow p-10 pt-20">
                <h1 className="text-4xl font-bold mb-6 text-center">Browse Products</h1>

                {/* Search Bar */}
                <div className="flex justify-center mb-6">
                    <input
                        type="text"
                        placeholder="Search for a product..."
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className={`ml-4 px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
                            }`}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Loading Animation */}
                {loading && (
                    <div className="flex flex-col justify-center items-center mt-6 space-y-4">
                        <div className="relative flex justify-center items-center">
                            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-opacity-75"></div>
                            <div className="absolute h-10 w-10 bg-blue-500 rounded-full"></div>
                        </div>
                        <p className="text-lg text-gray-700 font-semibold">Analyzing product details...</p>
                        <p className="text-sm text-gray-500">Please wait while we fetch AI-generated insights.</p>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {/* AI-Generated Product Display */}
                {aiProduct && (
                    <div className="my-8">
                        <h2 className="text-2xl font-semibold">AI-Generated Product</h2>
                        <ProductCard product={aiProduct} />
                    </div>
                )}

                {/* Product List from Database */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {products.length > 0 ? (
                        products.map((product: any) => <ProductCard key={product._id} product={product} />)
                    ) : (
                        <p className="text-gray-500">No products found.</p>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
}

// **Reusable Product Card Component with Factor Breakdown**
function ProductCard({ product }: { product: any }) {
    return (
        <div className="flex items-center border p-5 rounded-lg shadow-md bg-white transition duration-200 hover:shadow-lg">
            {/* Product Image */}
            <Image
                src={product.image && product.image.startsWith("http") ? product.image : "/images/default.png"}
                alt={product.name}
                width={150}
                height={150}
                className="rounded-lg object-cover"
                unoptimized
                onError={(e) => (e.currentTarget.src = "/images/default.png")} // ✅ Handle errors gracefully
            />

            {/* Product Details */}
            <div className="ml-6">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>

                {/* Sustainability Rating Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${product.rating > 75 ? "bg-green-500"
                            : product.rating > 50 ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                        style={{ width: `${product.rating}%` }}
                    ></div>
                </div>

                <p className="mt-2 text-sm text-gray-700">
                    Sustainability Score: <strong>{product.rating}%</strong>
                </p>
            </div>
        </div>
    );
}
