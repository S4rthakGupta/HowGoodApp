"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

            // Check if AI returned valid data
            if (!data || !data.description || !data.overallRating) {
                console.error("❌ AI Response Invalid:", data);
                throw new Error("AI returned an empty response.");
            }

            setAiProduct({
                name: search,
                description: data.description || "No description available.",
                rating: data.overallRating || 50,
                factorRatings: data.factorRatings || {},  // <-- Ensures it doesn't break if missing
                image: "/images/default.png",
            });


            console.log(`✅ AI Response Received for ${search}`);
        } catch (err) {
            console.error("❌ AI Error:", err);
            setError("AI could not generate a response. Try another product.");
        }

        setLoading(false);
    };


    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">🔒 Please log in to see product details.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900">
            {/* Navigation Bar */}
            <nav className="fixed top-0 w-full bg-white shadow-md py-4 px-8 flex justify-between items-center z-50">
                <h1 className="text-2xl font-semibold tracking-wide">HowGood</h1>
                <ul className="flex space-x-6 text-lg">
                    <li><Link href="/" className="hover:text-gray-600">Home</Link></li>
                    <li><Link href="/about" className="hover:text-gray-600">About</Link></li>
                    <li><Link href="/contact" className="hover:text-gray-600">Contact</Link></li>
                    <li>
                        <SignedOut>
                            <div className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-700 cursor-pointer">
                                <SignInButton mode="modal" />
                            </div>
                        </SignedOut>
                        <SignedIn>
                            <UserButton afterSignOutUrl="/" />
                        </SignedIn>
                    </li>
                </ul>
            </nav>

            {/* Page Content */}
            <div className="p-10 pt-20">
                <h1 className="text-4xl font-bold mb-6">Browse Products</h1>

                {/* Search Bar */}
                <div className="flex space-x-4">
                    <input
                        type="text"
                        placeholder="Search for a product..."
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={handleSearch}
                        className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"
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


                {/* **🔴 Error Message** */}
                {error && <p className="text-red-500 mt-4">{error}</p>}

                {/* **🟢 AI-Generated Product Display** */}
                {aiProduct && <ProductCard product={aiProduct} />}

                {/* **🟡 Product List from Database** */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {products.length > 0 ? (
                        products.map((product: any) => <ProductCard key={product._id} product={product} />)
                    ) : (
                        <p className="text-gray-500">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// **Reusable Product Card Component with Factor Breakdown**
function ProductCard({ product }: { product: any }) {
    return (
        <div className="flex items-center border p-5 rounded-lg shadow-md bg-white transition duration-200 hover:shadow-lg">
            {/* Product Image */}
            <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg" />

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

                {/* **🔵 Factor-Based Sustainability Breakdown** */}
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Sustainability Breakdown</h3>
                    {product.factorRatings && Object.entries(product.factorRatings).map(([factor, data]: any) => (
                        <div key={factor} className="mt-2">
                            <p className="text-gray-700"><strong>{factor}:</strong> {data.rating}%</p>
                            <p className="text-sm text-gray-500">{data.justification}</p>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
