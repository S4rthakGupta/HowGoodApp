import { useState } from 'react';
import axios from 'axios';

export default function ProductSearch() {
    const [query, setQuery] = useState('');
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/analyze/products', { query });
            setProduct(response.data.product);
        } catch (error) {
            console.error('Error fetching product:', error);
        }
        setLoading(false);
    };

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
