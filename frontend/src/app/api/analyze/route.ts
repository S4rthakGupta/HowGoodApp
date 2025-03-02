import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your .env.local has the correct key
});

const SERP_API_KEY = process.env.SERP_API_KEY; // SerpAPI for Google Image Search

async function fetchProductImage(productName: string) {
    try {
        const response = await axios.get(`https://serpapi.com/search`, {
            params: {
                api_key: SERP_API_KEY,
                engine: "google_images",
                q: `${productName} product`,
                hl: "en",
                gl: "us",
                num: 5,
            },
        });

        const validDomains = [
            "amazon.com", "shopify.com", "wikipedia.org", "wikimedia.org",
            "unsplash.com", "googleusercontent.com",
        ];

        const images = response.data.images_results || [];
        const filteredImages = images.filter((img: any) =>
            validDomains.some((domain) => img.original.includes(domain))
        );

        return filteredImages.length > 0 ? filteredImages[0].original : "/images/default.png";
    } catch (error) {
        console.error("❌ Failed to fetch product image:", error.message);
        return "/images/default.png";
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        console.log(`📩 AI Request Received for: ${name}`);

        // **🔹 Step 1: Generate Sustainability Score & Description using OpenAI**
        console.log("📝 Generating Sustainability Score & Description...");
        const prompt = `
        You are an expert in sustainability analysis. Your task is to analyze the sustainability of "${name}" 
        based on four key factors: 

        - Manufacturing Process
        - Packaging
        - Supply Chain Transparency
        - Carbon Footprint

        **Instructions:**
        1. Assign an overall sustainability score between **0-100%**.
        2. The score must be the **first line** of your response.
        3. Provide a **detailed product description** explaining the sustainability impact.

        ### **Example Output Format**:
        "Sustainability Score: 85%"
        Description: [A detailed description of the product’s sustainability impact.]

        Now, analyze "${name}" and provide the score and description in the exact format required.
        `;

        const openAIResponse = await openai.chat.completions.create({
            model: "gpt-4o", // ✅ Ensure GPT-4o is accessible
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300, // ✅ Increased for a detailed description
        });

        const aiResponseText = openAIResponse.choices[0]?.message?.content || "";
        console.log(`✅ AI Response: ${aiResponseText}`);

        // **Extract Sustainability Score**
        const scoreMatch = aiResponseText.match(/Sustainability Score: (\d+)%/);
        const overallRating = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

        // **Extract Product Description**
        const descriptionMatch = aiResponseText.match(/Description: (.+)/s);
        const productDescription = descriptionMatch ? descriptionMatch[1].trim() : "No description available.";

        if (!overallRating) {
            console.error("❌ AI did not return a valid sustainability score.");
            return NextResponse.json({ error: "AI could not generate a valid score." }, { status: 500 });
        }

        // **🔹 Step 2: Fetch Product Image**
        const imageUrl = await fetchProductImage(name);

        return NextResponse.json({
            name,
            description: productDescription, // ✅ AI-generated description
            overallRating,
            image: imageUrl,
        });

    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
