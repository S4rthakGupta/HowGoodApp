import { NextResponse } from "next/server";
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLASSIFICATION_MODEL = "facebook/bart-large-mnli"; // Model for text classification
const TEXT_GEN_MODEL = "tiiuae/falcon-7b-instruct"; // AI Model for description generation

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        console.log(`📩 AI Request Received for: ${name}`);

        let generatedDescription = description;

        // Step 1: Generate Description if Not Provided
        if (!description) {
            console.log("📝 No description provided. Generating one...");
            const descResponse = await axios.post(
                `https://api-inference.huggingface.co/models/${TEXT_GEN_MODEL}`,
                { inputs: `Write a short description for ${name}.` },
                { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
            );

            generatedDescription = descResponse.data[0]?.generated_text || "No description available.";
            console.log(`✅ AI-Generated Description: ${generatedDescription}`);
        }

        // Step 2: Generate Sustainability Rating
        const aiPrompt = `${name} - ${generatedDescription}`;
        const candidate_labels = ["sustainable", "eco-friendly", "wasteful", "polluting", "neutral"];

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${CLASSIFICATION_MODEL}`,
            { inputs: aiPrompt, parameters: { candidate_labels } },
            {
                headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            }
        );

        // Extract confidence scores
        const scores = response.data?.scores || [];
        console.log("🟢 AI Response:", scores);

        // Determine sustainability rating (default: 50)
        let rating = 50;
        if (scores.length > 0) {
            const highestScore = Math.max(...scores);
            rating = Math.round(highestScore * 100); // Convert to percentage
        }

        return NextResponse.json({ description: generatedDescription, rating });
    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.response?.data || error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
