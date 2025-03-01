import { NextResponse } from "next/server";
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const AI_MODEL = "facebook/bart-large-mnli"; // Model for text classification

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        console.log(`📩 AI Request Received for: ${name} - ${description}`);

        // AI Model Prompt
        const aiPrompt = `${name} - ${description}`;

        // Define sustainability labels
        const candidate_labels = ["sustainable", "eco-friendly", "wasteful", "polluting", "neutral"];

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${AI_MODEL}`,
            { inputs: aiPrompt, parameters: { candidate_labels } },
            {
                headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` },
            }
        );

        // Extract confidence scores
        const scores = response.data.scores || [];
        console.log("🟢 AI Response:", scores);

        // Find the highest-rated sustainability score
        let rating = 50; // Default score if AI fails
        if (scores.length > 0) {
            const highestScore = Math.max(...scores);
            rating = Math.round(highestScore * 100); // Convert to percentage
        }

        return NextResponse.json({ rating });
    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.response?.data || error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
