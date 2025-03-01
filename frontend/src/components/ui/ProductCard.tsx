import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductCard({ product }) {
    const [sustainability, setSustainability] = useState(null);
    const [factorRatings, setFactorRatings] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!product) return;

        setLoading(true);

        fetch('/api/analyze', { // ✅ Fix API endpoint
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: product.name, // ✅ Fix: Ensure correct parameter name
                description: product.description,
            }),
        })
            .then(res => res.json())
            .then(data => {
                setSustainability(data.overallRating || "N/A");
                setFactorRatings(data.factorRatings || {});
            })
            .catch(error => {
                console.error("AI Fetch Error:", error);
                setSustainability("Error retrieving rating");
            })
            .finally(() => setLoading(false));
    }, [product]);


    return (
        <div className="border p-4 rounded-lg shadow-md bg-white transition duration-200 hover:shadow-lg">
            {/* Product Image */}
            <Image src={product.image} alt={product.name} width={150} height={150} className="rounded-lg w-full h-32 object-cover" />

            {/* Product Name & Description */}
            <h3 className="text-xl font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>

            {/* AI Sustainability Rating */}
            {loading ? (
                <p className="text-sm text-gray-500 mt-2">🔄 Loading AI Rating...</p>
            ) : (
                <p className="text-green-600 font-semibold mt-2">♻ Sustainability: {sustainability}%</p>
            )}

            {/* Factor-Based Sustainability Breakdown */}
            {factorRatings && Object.keys(factorRatings).length > 0 ? (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold">Sustainability Breakdown</h3>
                    {Object.entries(factorRatings).map(([factor, data]: any) => (
                        <div key={factor} className="mt-2">
                            <p className="text-gray-700"><strong>{factor}:</strong> {data.rating ?? "N/A"}%</p>
                            <p className="text-sm text-gray-500">{data.justification || "No details provided."}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 mt-2">Sustainability data is currently unavailable.</p>
            )}
        </div>
    );
}
