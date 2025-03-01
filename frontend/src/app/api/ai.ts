import { NextResponse } from 'next/server';
import { getAISustainabilityRating } from '@/lib/aiUtils';

export async function POST(req) {
    const { productName, description } = await req.json();
    const rating = await getAISustainabilityRating(productName, description);
    return NextResponse.json({ rating });
}
