import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Shop from "@/models/Shop";

// This function fetches the products for the dashboard
export async function GET(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');

    if (!shopId) {
        return NextResponse.json({ error: 'Shop ID is required' }, { status: 400 });
    }

    await dbConnect();

    try {
        const shop = await Shop.findOne({ _id: shopId, owner: session.user.id });
        if (!shop) {
            return NextResponse.json({ error: 'Shop not found or you do not own this shop' }, { status: 404 });
        }

        const products = await Product.find({ shop: shopId });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return NextResponse.json({ error: "Server error while fetching products." }, { status: 500 });
    }
}

// This function adds a new product
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { name, price, quantity, shopId } = await request.json();

        if (!name || !price || !shopId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const shop = await Shop.findOne({ _id: shopId, owner: session.user.id });
        if (!shop) {
            return NextResponse.json({ error: 'Shop not found or you do not own this shop' }, { status: 404 });
        }

        const newProduct = new Product({
            name,
            price: parseFloat(price),
            quantity: quantity ? parseInt(quantity) : 0,
            shop: shopId,
        });

        await newProduct.save();

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Failed to add product:", error);
        return NextResponse.json({ error: "Server error while adding product." }, { status: 500 });
    }
}