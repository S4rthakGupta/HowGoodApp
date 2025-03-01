import { HfInference } from '@huggingface/inference';

const hf = new HfInference('your-huggingface-api-key');

export async function getAISustainabilityRating(name, description) {
    const prompt = `Rate the sustainability of ${name}. Description: ${description}`;
    const response = await hf.textGeneration({
        model: 'google/flan-t5-large',
        inputs: prompt,
    });

    return response.generated_text; // Extract rating from AI response
}
