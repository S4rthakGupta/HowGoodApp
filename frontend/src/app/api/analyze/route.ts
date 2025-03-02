import { NextResponse } from "next/server";
import axios from "axios";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const SERP_API_KEY = process.env.SERP_API_KEY; // SerpAPI for Google Image Search

// **🔹 Improved Product Image Fetching**
async function fetchProductImage(productName: string) {
    try {
        console.log(`🔍 Fetching image for: ${productName}`);
        const response = await axios.get(`https://serpapi.com/search`, {
            params: {
                api_key: SERP_API_KEY,
                engine: "google_images",
                q: `${productName} official product image`,
                hl: "en",
                gl: "us",
                num: 5,
            },
        });

        // **Only Select High-Quality Product Images**
        const validDomains = [
            "amazon.com", "walmart.com", "ebay.com",
            "shopify.com", "target.com", "bestbuy.com"
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

// **🔹 Validate Product Input**
function validateInput(query: string) {
    if (!query || query.trim() === "") {
        return "Please enter a valid product name or URL.";
    }

    // **If it's a URL, validate it**
    if (query.startsWith("http")) {
        const validDomains = ["amazon", "walmart", "ebay", "bestbuy"];
        if (!validDomains.some(domain => query.includes(domain))) {
            return "Only Amazon, Walmart, eBay, and BestBuy URLs are supported.";
        }
    }

    return null;
}

// **🔹 AI Analysis API**
export async function POST(req: Request) {
    try {
        const { searchQuery } = await req.json();
        console.log(`📩 AI Request Received for: ${searchQuery}`);

        // **Validate Input Before Proceeding**
        const validationError = validateInput(searchQuery);
        if (validationError) {
            return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // **🔹 Step 1: Generate Sustainability Score & Description using OpenAI**
        console.log("📝 Generating Sustainability Score & Description...");
        const prompt = `
        You are an expert in sustainability analysis. Analyze the sustainability of "${searchQuery}" 
        based on:

        - Manufacturing Process
        - Packaging
        - Supply Chain Transparency
        - Carbon Footprint

        Provide:
        1. A sustainability score (0-100%) on the first line.
        2. A detailed explanation.

        ### **Example Output Format**:
        "Sustainability Score: 85%"
        Description: [A detailed description of the product’s sustainability impact.]

        Now analyze "${searchQuery}".
        `;

        const openAIResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
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
            return NextResponse.json({ error: "AI could not generate a valid score." }, { status: 500 });
        }

        // **🔹 Step 2: Fetch Product Image**
        const imageUrl = await fetchProductImage(searchQuery);

        return NextResponse.json({
            name: searchQuery,
            description: productDescription,
            overallRating,
            image: imageUrl,
        });

    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
