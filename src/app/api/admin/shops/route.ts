import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    try {
        const shops = await Shop.find({}).populate('owner', 'name email'); // Populate owner info
        return NextResponse.json(shops);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}