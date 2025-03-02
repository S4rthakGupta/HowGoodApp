"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
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

            // Check if AI returned valid data
            if (!data || !data.description || !data.overallRating) {
                console.error("❌ AI Response Invalid:", data);
                throw new Error("AI returned an empty response.");
            }

            setAiProduct({
                name: search,
                description: data.description || "No description available.",
                rating: data.overallRating || 50,
                factorRatings: data.factorRatings || {},
                image: data.image && data.image.startsWith("http") ? data.image : "/images/default.png", // ✅ Ensures valid images
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
                        <h2 className="text-2xl font-semibold">Product Details</h2>
                        <AiProductCard product={aiProduct} />
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

// **AI Product Card Component**
function AiProductCard({ product }: { product: any }) {
    const circleRef = useRef<SVGCircleElement | null>(null);

    useEffect(() => {
        if (circleRef.current) {
            const radius = circleRef.current.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (product.rating / 100) * circumference;
            circleRef.current.style.strokeDashoffset = `${offset}`;
        }
    }, [product.rating]);

    return (
        <div className="flex justify-center items-center p-6">
            <div className="w-full md:w-2/3 bg-transparent backdrop-blur-lg rounded-lg shadow-lg flex p-6 gap-x-8">
                {/* Left: Product Image */}
                <div className="w-1/3">
                    <Image
                        src={product.image}
                        alt={product.name}
                        width={500}
                        height={200}
                        className="rounded-lg object-cover"
                        unoptimized
                        onError={(e) => (e.currentTarget.src = "/images/default.png")}
                    />
                </div>

                {/* Right: Product Details */}
                <div className="w-2/3">
                    {/* Product Name with Gray Background */}
                    <h2 className="text-2xl font-bold bg-gray-200 p-4 rounded-lg">{product.name}</h2>
                    <p className="text-gray-600 mt-2">{product.description}</p>

                    {/* Sustainability Details */}
                    <div className="mt-4 bg-gray-100 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold">Sustainability of {product.name}</h3>
                        <ul className="list-disc pl-6 mt-2 text-gray-700">
                            {product.factorRatings && Object.entries(product.factorRatings).map(([key, value]) => (
                                <li key={key} className="text-sm">{`${key}: ${value}`}</li>
                            ))}
                        </ul>
                    </div>

                    {/* Sustainability Circular Progress */}
                    <div className="flex justify-center items-center mt-4">
                        <svg width="120" height="120" className="transform rotate-90">
                            <circle
                                cx="60"
                                cy="60"
                                r="50"
                                stroke="lightgray"
                                strokeWidth="10"
                                fill="none"
                            />
                            <circle
                                ref={circleRef}
                                cx="60"
                                cy="60"
                                r="50"
                                stroke={
                                    product.rating < 30
                                        ? 'red' 
                                        : product.rating >= 30 && product.rating < 50
                                        ? 'orange' 
                                        : product.rating >= 50 && product.rating < 80
                                        ? 'yellow' 
                                        : 'green'
                                }
                                
                                strokeWidth="10"
                                fill="none"
                                strokeDasharray="314" // Circumference of the circle (2 * Pi * radius)
                                strokeDashoffset="314"
                                style={{
                                    transitionProperty: "stroke-dashoffset",
                                    transitionDuration: "0.5s",
                                    transitionTimingFunction: "ease"
                                }}
                            />
                        </svg>
                    </div>

                    {/* Rating Percentage Below the Circle */}
                    <div className="flex justify-center items-center mt-2">
                        <p className="text-lg font-semibold text-gray-700">Sustainability Score: <strong>{product.rating}%</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}


// **Reusable Product Card Component (Mongoose Products)**
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
                onError={(e) => (e.currentTarget.src = "/images/default.png")} // Handle errors gracefully
            />

            {/* Product Details */}
            <div className="ml-6">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>

                {/* Sustainability Rating Bar */}
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${
                            product.rating < 30
                                ? "bg-red-500"
                                : product.rating >= 30 && product.rating < 50
                                ? "bg-orange-500"
                                : product.rating >= 50 && product.rating < 80
                                ? "bg-yellow-500"
                                : "bg-green-500"
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
