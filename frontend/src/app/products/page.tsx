'use client';

import { useUser } from "@clerk/nextjs";

export default function Products() {
    const { user } = useUser();

    if (!user) return <p>Please log in to see product details.</p>;

    return <p>Welcome, {user.fullName}! You can now see the product details.</p>;
}
