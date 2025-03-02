"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";

export default function ProductsPage() {
    const { user } = useUser();
    const [products, setProducts] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [urlSearch, setUrlSearch] = useState("");
    const [aiProduct, setAiProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // **Fetch existing products from MongoDB**
    useEffect(() => {
        async function fetchProducts() {
            try {
                const res = await fetch("/api/products");
                const data = await res.json();

                // Select featured products (change number as needed)
                const featured = data.slice(0, 2);

                setProducts(data.filter(p => !featured.includes(p))); // Avoid duplication
                setFeaturedProducts(featured);
            } catch (err) {
                console.error("Error fetching products:", err);
            }
        }
        fetchProducts();
    }, []);

    // **Validate Input**
    const validateInput = (query: string, isURL: boolean) => {
        if (!query.trim()) {
            return "Please enter a valid product name or URL.";
        }

        if (isURL) {
            const validDomains = ["amazon", "walmart", "ebay", "bestbuy"];
            if (!validDomains.some(domain => query.includes(domain))) {
                return "Only Amazon, Walmart, eBay, and BestBuy URLs are supported.";
            }
        }

        return null;
    };

    // **Handle Product Search**
    const handleSearch = async (query: string, isURL = false) => {
        const validationError = validateInput(query, isURL);
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setAiProduct(null);
        setError("");

        try {
            console.log(`🔍 Searching AI for: ${query}`);

            const response = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ searchQuery: query, isURL }),
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const data = await response.json();
            setAiProduct({
                name: data.name,
                description: data.description || "No description available.",
                rating: data.overallRating || 50,
                image: data.image.startsWith("http") ? data.image : "/images/default.png",
            });

            console.log(`✅ AI Response Received for ${query}`);
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
        <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col">
            <NavBar />

            {/* Page Content */}
            <div className="flex-grow p-10 pt-20">
                <h1 className="text-4xl font-bold mb-6 text-center">Browse Products</h1>

                {/* Search Bar for Product Name */}
                <div className="flex flex-col md:flex-row justify-center mb-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search by product name..."
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        onClick={() => handleSearch(search)}
                        className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* URL Search Bar for Product Extraction */}
                <div className="flex flex-col md:flex-row justify-center mb-6 gap-4">
                    <input
                        type="text"
                        placeholder="Paste Amazon, Walmart, or eBay product URL..."
                        className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg"
                        value={urlSearch}
                        onChange={(e) => setUrlSearch(e.target.value)}
                    />
                    <button
                        onClick={() => handleSearch(urlSearch, true)}
                        className={`px-6 py-2 rounded-lg text-white ${loading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-700"}`}
                        disabled={loading}
                    >
                        {loading ? "Extracting..." : "Extract from URL"}
                    </button>
                </div>

                {/* Loading Animation */}
                {loading && (
                    <div className="flex flex-col justify-center items-center mt-6 space-y-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-opacity-75"></div>
                        <p className="text-lg text-gray-700 font-semibold">Analyzing product details...</p>
                    </div>
                )}

                {/* Error Message */}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

                {/* AI-Generated Product Display */}
                {aiProduct && (
                    <div className="my-8">
                        <h2 className="text-2xl font-semibold text-center">AI-Generated Product</h2>
                        <ProductCard product={aiProduct} />
                    </div>
                )}

                {/* Product List from Database */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                    {products.length > 0 ? (
                        products.map((product: any) => <ProductCard key={product._id} product={product} />)
                    ) : (
                        <p className="text-gray-500 text-center">No products found.</p>
                    )}
                </div>

                {/* Featured Products Section */}
                {!loading && featuredProducts.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-center mb-6">🌟 Featured Products</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product: any) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

// **Reusable Product Card Component with Colored Sustainability Score**
function ProductCard({ product }: { product: any }) {
    const getSustainabilityColor = (score: number) => {
        if (score <= 40) return "bg-red-700";
        if (score <= 70) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="flex flex-col items-center border p-5 rounded-lg shadow-md bg-white transition duration-200 hover:shadow-lg">
            <Image
                src={product.image && product.image.startsWith("http") ? product.image : "/images/default.png"}
                alt={product.name}
                width={180}
                height={180}
                className="rounded-lg object-cover"
                unoptimized
            />

            <h2 className="text-xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>

            <div className={`w-24 h-24 flex items-center justify-center text-white text-2xl font-bold rounded-full mt-4 ${getSustainabilityColor(product.rating)}`}>
                {product.rating}%
            </div>
            <p className="mt-2 text-lg font-semibold text-gray-700">Sustainability Score</p>
        </div>
    );
}
