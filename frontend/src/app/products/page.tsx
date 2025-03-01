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

    useEffect(() => {
        async function fetchProducts() {
            const res = await fetch("/api/products");
            const data = await res.json();
            setProducts(data);
        }
        fetchProducts();
    }, []);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-gray-600">🔒 Please log in to see product details.</p>
            </div>
        );
    }

    const filteredProducts = products.filter((product: any) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSearch = async () => {
        if (!search) return;
        setLoading(true);
        setAiProduct(null);

        // Check if the product exists in MongoDB
        if (filteredProducts.length > 0) {
            setLoading(false);
            return;
        }

        try {
            // Fetch AI-generated product details
            const response = await fetch("/api/analyze", {
                method: "POST",
                body: JSON.stringify({ name: search }),
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            setAiProduct({
                name: search,
                description: data.description,
                rating: data.rating,
                image: "/images/default.png", // Default placeholder image
            });
        } catch (error) {
            console.error("AI Analysis Failed:", error);
        }

        setLoading(false);
    };

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
                        className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                        disabled={loading}
                    >
                        {loading ? "Searching..." : "Search"}
                    </button>
                </div>

                {/* Product List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product: any) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : aiProduct ? (
                        <ProductCard product={aiProduct} />
                    ) : (
                        <p className="text-gray-500">No products found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// Product Card Component
function ProductCard({ product }: { product: any }) {
    return (
        <div className="flex items-center border p-5 rounded-lg shadow-md">
            {/* Product Image */}
            <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg" />

            {/* Product Details */}
            <div className="ml-6">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600">{product.description}</p>

                {/* Sustainability Rating */}
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                        className={`h-4 rounded-full transition-all duration-500 ${product.rating > 75
                            ? "bg-green-500"
                            : product.rating > 50
                                ? "bg-yellow-500"
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
