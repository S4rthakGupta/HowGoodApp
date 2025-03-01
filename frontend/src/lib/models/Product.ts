import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: null } // AI will calculate this later
});

export const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
