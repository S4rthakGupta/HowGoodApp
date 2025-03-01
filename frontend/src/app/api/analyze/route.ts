import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/lib/models/products';
import { analyzeProductSustainability } from '@/lib/aiUtils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }

        let product = await Product.findOne({ name: query });

        if (!product) {
            // Call AI model to analyze sustainability
            const aiResponse = await analyzeProductSustainability(query);

            product = new Product({
                name: query,
                image: '/images/default.jpg',  // Placeholder if no image is found
                description: aiResponse.description,
                rating: aiResponse.rating
            });

            await product.save();
        }

        return res.status(200).json({ product });

    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
