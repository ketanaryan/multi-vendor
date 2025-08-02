import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function GET(_request: Request) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'vendor') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();

    try {
        const shop = await Shop.findOne({ owner: session.user.id });
        if (!shop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }
        return NextResponse.json(shop);
    } catch (_error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}