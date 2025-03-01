"use client";

import { useUser } from "@clerk/nextjs";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
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

<<<<<<< HEAD
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
        <div className="min-h-screen bg-white text-gray-900">
            
            {/* Navigation Bar (Copied from HomePage) */}
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
            <div className="p-10 pt-20"> {/* Added pt-20 to prevent content from overlapping with nav */}
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
        </div>
    );
=======
    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Enter product name or URL"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="p-2 border rounded w-full"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded mt-2 w-full"
            >
                Search
            </button>

            {loading && <p>Loading...</p>}

            {product && (
                <div className="mt-4 p-4 border rounded">
                    <h2 className="text-xl font-bold">{product.name}</h2>
                    <img src={product.image} alt={product.name} className="w-32 h-32 object-cover mt-2" />
                    <p className="mt-2">{product.description}</p>
                    <p className="font-bold text-green-500">Sustainability Rating: {product.rating}/100</p>
                </div>
            )}
        </div>
    );
>>>>>>> parent of e7edc50 (Merge branch 'main' of https://github.com/S4rthakGupta/HowGoodApp)
}
