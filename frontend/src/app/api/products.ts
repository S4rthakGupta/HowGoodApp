import { NextResponse } from 'next/server';
import db from '@/lib/db'; // Assuming a MongoDB/Firebase setup

export async function GET(req) {
    const products = await db.collection('products').find().toArray();
    return NextResponse.json(products);
}
