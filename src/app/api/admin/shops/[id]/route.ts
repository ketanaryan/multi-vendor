import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Shop from "@/models/Shop";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json();

    if (!['approved', 'blocked'].includes(status)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    
    await dbConnect();

    try {
        const updatedShop = await Shop.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedShop) {
            return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
        }
        return NextResponse.json(updatedShop);
    } catch (_error) {
        console.error("Admin Update Shop Error:", _error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}