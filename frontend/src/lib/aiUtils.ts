import axios from 'axios';

export async function analyzeProductSustainability(productName: string) {
    const apiKey = process.env.OPENAI_API_KEY; // Store your API key in .env.local
    const prompt = `Analyze the sustainability impact of the product: "${productName}" and provide a rating (0-100) along with a brief description.`;

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: 'gpt-4',
                prompt: prompt,
                max_tokens: 150
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const resultText = response.data.choices[0].text.trim();
        const rating = parseInt(resultText.match(/\d+/)?.[0] || '50'); // Extract rating

        return {
            description: resultText,
            rating
        };
    } catch (error) {
        console.error('AI Analysis Error:', error);
        return {
            description: 'Could not determine sustainability.',
            rating: 50
        };
    }
}
