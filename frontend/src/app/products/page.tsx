"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductsPage() {
    const { user } = useUser(); // Clerk Authentication
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");

    // Fetch products from API
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

    return (
        <div className="min-h-screen bg-white text-gray-900 p-10">
            {/* Page Title */}
            <h1 className="text-4xl font-bold mb-6">Browse Products</h1>

            {/* Search Bar */}
            <input
                type="text"
                placeholder="Search for a product..."
                className="w-full p-3 border border-gray-300 rounded-lg mb-6"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {/* Product List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product: any) => (
                        <div key={product._id} className="flex items-center border p-5 rounded-lg shadow-md">
                            {/* Product Image (Left) */}
                            <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg" />

                            {/* Product Details (Right) */}
                            <div className="ml-6">
                                <h2 className="text-xl font-bold">{product.name}</h2>
                                <p className="text-gray-600">{product.description}</p>

                                {/* Sustainability Rating Bar */}
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

                                {/* Rating Text */}
                                <p className="mt-2 text-sm text-gray-700">
                                    Sustainability Score: <strong>{product.rating}%</strong>
                                </p>

                                {/* View More Button */}
                                <Link href={`/products/${product._id}`} className="text-blue-500 hover:underline mt-3 inline-block">
                                    View More
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No products found.</p>
                )}
            </div>
        </div>
    );
}
