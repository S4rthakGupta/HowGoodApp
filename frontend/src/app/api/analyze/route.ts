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
            return "Only Amazon, Walmart, eBay, and BestBuy URLs are supported as of now.";
        }
    }

    return null;
}

// **🔹 Extract Sections from AI Response**
function extractSections(text: string): { [key: string]: string } {
    const sections: { [key: string]: string } = {
        "Brief Summary": "No summary available.",
        "Manufacturing Process": "No data available.",
        "Packaging": "No data available.",
        "Supply Chain Transparency": "No data available.",
        "Carbon Footprint": "No data available."
    };

    // Normalize AI response
    text = text.trim();

    // Split AI response into parts based on "**Section Name:**"
    const parts = text.split(/\*\*/g).map(part => part.trim());

    for (let i = 0; i < parts.length; i++) {
        const title = parts[i].replace(":", "").trim(); // Remove ":" and extra spaces

        if (sections[title] !== undefined && i + 1 < parts.length) {
            sections[title] = parts[i + 1].replace(/\n/g, "<br>").trim();
        }
    }

    return sections;
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

**Manufacturing Process**
**Packaging**
**Supply Chain Transparency**
**Carbon Footprint**

Provide:
1. A **brief summary (2-3 sentences)** about the sustainability of the product.
2. **Bullet points** for each key aspect (Manufacturing, Packaging, Supply Chain Transparency, Carbon Footprint).

### **Example Output Format**:
Sustainability Score: 85%

**Brief Summary:**  
[2-3 sentences summarizing the sustainability of the product.]

**Key Insights:**
**Manufacturing Process:** [Details]
**Packaging:** [Details]
**Supply Chain Transparency:** [Details]
**Carbon Footprint:** [Details]

Now analyze "${searchQuery}".
`;


        const openAIResponse = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500,
        });

        const aiResponseText = openAIResponse.choices[0]?.message?.content || "";
        console.log(`✅ AI Response: ${aiResponseText}`);

        // **Extract Sustainability Score**
        const scoreMatch = aiResponseText.match(/Sustainability Score: (\d+)%/);
        const overallRating = scoreMatch ? parseInt(scoreMatch[1], 10) : null;

        // **Extract & Format the Description Properly**
        const extractedSections = extractSections(aiResponseText);

        const formattedDescription = `
            <p><strong>Brief Summary:</strong> ${extractedSections["Brief Summary"]}</p>
            
            <h3 class="text-lg font-semibold mt-4">Key Insights:</h3>
            <ul class="list-disc pl-6 mt-2">
                <li><strong>Manufacturing Process:</strong> ${extractedSections["Manufacturing Process"]}</li>
                <li><strong>Packaging:</strong> ${extractedSections["Packaging"]}</li>
                <li><strong>Supply Chain Transparency:</strong> ${extractedSections["Supply Chain Transparency"]}</li>
                <li><strong>Carbon Footprint:</strong> ${extractedSections["Carbon Footprint"]}</li>
            </ul>
        `;
        
        

        if (!overallRating) {
            return NextResponse.json({ error: "AI could not generate a valid score." }, { status: 500 });
        }

        // **🔹 Step 2: Fetch Product Image**
        const imageUrl = await fetchProductImage(searchQuery);

        return NextResponse.json({
            name: searchQuery,
            description: formattedDescription,
            overallRating,
            image: imageUrl,
        });

    } catch (error) {
        console.error("❌ AI Analysis Failed:", error.message);
        return NextResponse.json({ error: "AI Analysis Failed" }, { status: 500 });
    }
}
