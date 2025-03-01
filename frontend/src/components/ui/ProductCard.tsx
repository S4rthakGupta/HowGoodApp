import { useEffect, useState } from 'react';

export default function ProductCard({ product }) {
    const [sustainability, setSustainability] = useState(null);

    useEffect(() => {
        fetch('/api/ai', {
            method: 'POST',
            body: JSON.stringify({
                productName: product.name,
                description: product.description,
            }),
        })
            .then(res => res.json())
            .then(data => setSustainability(data.rating));
    }, [product]);

    return (
        <div className="border p-4 rounded-lg">
            <img src={product.image} alt={product.name} className="w-full h-32" />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            {sustainability ? <p>♻ Sustainability: {sustainability}</p> : <p>Loading AI Rating...</p>}
        </div>
    );
}
