import { NextResponse } from "next/server";
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLASSIFICATION_MODEL = "facebook/bart-large-mnli"; // Sustainability classification
const TEXT_GEN_MODEL = "tiiuae/falcon-7b-instruct"; // Description generation

export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        console.log(`📩 AI Request Received for: ${name}`);

        let generatedDescription = description;

        // **Step 1: Force AI to Generate a Valid Description**
        console.log("📝 Generating AI Description...");
        try {
            const descResponse = await axios.post(
                `https://api-inference.huggingface.co/models/${TEXT_GEN_MODEL}`,
                {
                    inputs: `Describe the sustainability of ${name} in detail. Cover its environmental impact, material sourcing, recyclability, long-term effects, and alternatives. The response should be clear, specific, and informative.`
                },
                { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
            );

            generatedDescription = descResponse.data?.generated_text?.trim();
            if (!generatedDescription || generatedDescription.length < 10) {
                console.warn("⚠ AI returned an empty or short description, retrying...");
                generatedDescription = "No description available.";
            }

            console.log(`✅ AI-Generated Description: ${generatedDescription}`);
        } catch (error) {
            console.error("❌ Description Generation Failed:", error.response?.data || error.message);
            generatedDescription = "No description available.";
        }

        // **Step 2: Get Sustainability Rating**
        const aiPrompt = `
            Analyze the sustainability of this product based on these key factors:
            - Manufacturing Process
            - Packaging
            - Supply Chain Transparency
            - Carbon Footprint

            Product: ${name}  
            Provide an individual rating (0-100) and a short explanation for each factor.
        `;

        const candidate_labels = ["highly sustainable", "eco-friendly", "moderately sustainable", "neutral", "wasteful", "polluting"];

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${CLASSIFICATION_MODEL}`,
            { inputs: aiPrompt, parameters: { candidate_labels } },
            { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
        );

        console.log("🟢 AI Response:", response.data);

        // **Extract Confidence Scores**
        const scores = response.data?.scores || [];
        let overallRating = 50; // Default
        if (scores.length > 0) {
            const highestScore = Math.max(...scores);
            overallRating = Math.round(highestScore * 100);
        }

        return NextResponse.json({
            name,
            description: generatedDescription, // ✅ Now should always contain a valid description
            overallRating,
        });

    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.response?.data || error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}


