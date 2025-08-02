import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET() {
    await dbConnect();

    try {
        const approvedShops = await Shop.find({ status: 'approved' });
        return NextResponse.json(approvedShops);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}