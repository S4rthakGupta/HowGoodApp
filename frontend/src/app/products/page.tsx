"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import NavBar from "@/components/Nav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";


import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";


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
                const featured = data.slice(0, 10);

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
                    <Button
                        onClick={() => handleSearch(search)}
                        variant="default"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </Button>

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
                    <Button
                        onClick={() => handleSearch(urlSearch, true)}
                        variant="outline"
                        disabled={loading}
                    >
                        {loading ? "Extracting..." : "Extract from URL"}
                    </Button>

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
                        <h2 className="text-2xl font-semibold">Product Details</h2>
                        <AiProductCard product={aiProduct} />
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
                        <h2 className="text-3xl font-bold text-center mb-6">Products</h2>
                        <Carousel className="w-full max-w-4xl mx-auto">
                            <CarouselContent>
                                {featuredProducts.map((product, index) => (
                                    <CarouselItem key={index} className="basis-1/3">
                                        <div className="p-1">
                                            <Card className="shadow-lg border">
                                                <CardContent className="p-4 flex flex-col items-center">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-32 h-32 object-contain rounded-lg mb-4 mx-auto"
                                                        onError={(e) => (e.currentTarget.src = "/images/default.png")}
                                                    />
                                                    <h3 className="text-lg font-semibold">{product.name}</h3>
                                                    <p className="text-gray-600 text-sm text-center">
                                                        {product.description}
                                                    </p>
                                                    {/* Sustainability Score Bar */}
                                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                                        <div
                                                            className={`h-2 rounded-full ${product.rating < 30
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
                                                    <p className="text-sm text-gray-700 mt-2">
                                                        Sustainability Score: <strong>{product.rating}%</strong>
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>
                )}

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
                onError={(e) => (e.currentTarget.src = "/images/default.png")} // Handle errors gracefully
            />

            <h2 className="text-xl font-bold mt-4">{product.name}</h2>
            <p className="text-gray-600">{product.description}</p>

            {/* Sustainability Rating Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                <div
                    className={`h-4 rounded-full transition-all duration-500 ${product.rating < 30
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

            {/* Removed the extra closing div */}
            <p className="mt-2 text-lg font-semibold text-gray-700">Sustainability Score</p>
        </div>
    );
}
