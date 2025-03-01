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
