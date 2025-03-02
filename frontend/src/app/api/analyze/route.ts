import { NextResponse } from "next/server";
import axios from "axios";

const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
const CLASSIFICATION_MODEL = "facebook/bart-large-mnli"; // Sustainability classification
const TEXT_GEN_MODEL = "tiiuae/falcon-7b-instruct"; // Description generation
const SERP_API_KEY = process.env.SERP_API_KEY; // SerpAPI Key for Google Image Search

// **🔹 Function to Fetch Product Image Using SerpAPI**
// async function fetchProductImage(productName: string) {
//     try {
//         const response = await axios.get(`https://serpapi.com/search`, {
//             params: {
//                 api_key: SERP_API_KEY,
//                 engine: "google_images",
//                 q: productName,
//                 hl: "en",
//                 gl: "us",
//                 num: 1,
//             },
//         });

//         // **Extract First Image URL**
//         const imageUrl = response.data.images_results?.[0]?.original || "/images/default.png";
//         console.log(`🖼️ Image Found for ${productName}: ${imageUrl}`);
//         return imageUrl;
//     } catch (error) {
//         console.error("❌ Failed to fetch product image:", error.response?.data || error.message);
//         return "/images/default.png"; // Fallback image
//     }
// }

async function fetchProductImage(productName: string) {
    try {
        const response = await axios.get(`https://serpapi.com/search`, {
            params: {
                api_key: SERP_API_KEY,
                engine: "google_images",
                q: `${productName} product`, // Improves search relevance
                hl: "en",
                gl: "us",
                num: 5, // Get multiple images for filtering
            },
        });

        // **Filter Out Unwanted Images**
        const validDomains = [
            "amazon.com",
            "shopify.com",
            "wikipedia.org",
            "wikimedia.org",
            "unsplash.com",
            "googleusercontent.com",
        ];

        const images = response.data.images_results || [];

        // **Prioritize Product Images from Trusted Domains**
        const filteredImages = images.filter((img: any) =>
            validDomains.some((domain) => img.original.includes(domain))
        );

        // **Pick the Best Image (or fallback to default)**
        const selectedImage = filteredImages.length > 0
            ? filteredImages[0].original
            : images.length > 0
                ? images[0].original
                : "/images/default.png"; // Fallback if no valid image

        console.log(`🖼️ Selected Image for ${productName}: ${selectedImage}`);
        return selectedImage;
    } catch (error) {
        console.error("❌ Failed to fetch product image:", error.response?.data || error.message);
        return "/images/default.png"; // Fallback image
    }
}





export async function POST(req: Request) {
    try {
        const { name, description } = await req.json();
        console.log(`📩 AI Request Received for: ${name}`);

        let generatedDescription = description;

        // **🔹 Step 1: AI Description Generation**
        console.log("📝 Generating AI Description...");
        try {
            const descResponse = await axios.post(
                `https://api-inference.huggingface.co/models/${TEXT_GEN_MODEL}`,
                {
                    inputs: `Describe the sustainability of ${name} in detail. Cover its environmental impact, material sourcing, recyclability, long-term effects, and alternatives. The response should be clear, specific, and informative.`,
                },
                { headers: { Authorization: `Bearer ${HUGGING_FACE_API_KEY}` } }
            );

            // ✅ Extract AI-generated description properly
            if (Array.isArray(descResponse.data) && descResponse.data.length > 0) {
                generatedDescription = descResponse.data[0]?.generated_text?.trim() || "No description available.";
            } else {
                console.warn("⚠ AI returned an unexpected response format:", descResponse.data);
                generatedDescription = "No description available.";
            }

            console.log(`✅ AI-Generated Description: ${generatedDescription}`);
        } catch (error) {
            console.error("❌ Description Generation Failed:", error.response?.data || error.message);
            generatedDescription = "No description available.";
        }

        // **🔹 Step 2: Fetch Sustainability Rating**
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

        // **🔹 Step 3: Fetch Product Image from Google**
        const imageUrl = await fetchProductImage(name);

        return NextResponse.json({
            name,
            description: generatedDescription, // ✅ Always contains a valid description
            overallRating,
            image: imageUrl, // ✅ Added dynamic image URL
        });

    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.response?.data || error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
