import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";
import axios from "axios";

export async function GET() {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json(products);
}

export async function POST(req: Request) {
    await connectToDatabase();
    const { name, image, description } = await req.json();

    // Fetch AI sustainability rating
    const aiRes = await axios.post("http://localhost:3000/api/analyze", {
        name,
        description,
    });

    const rating = aiRes.data.rating || 50; // Default to 50 if AI fails

    // Save product in MongoDB
    const newProduct = new Product({ name, image, description, rating });
    await newProduct.save();

    return NextResponse.json(newProduct, { status: 201 });
}
