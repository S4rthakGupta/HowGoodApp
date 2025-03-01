import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Product } from "@/lib/models/Product";

export async function GET() {
    await connectToDatabase();
    const products = await Product.find({});
    return NextResponse.json(products);
}
