import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Shop from '@/models/Shop';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

export async function POST(request: Request) {
  const { name, email, password, shopName, shopAddress, shopCity, shopCategory } = await request.json();

  if (!name || !email || !password || !shopName || !shopAddress || !shopCity || !shopCategory) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  await dbConnect();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: 'vendor',
    });
    const savedUser = await newUser.save({ session });

    const newShop = new Shop({
      owner: savedUser._id,
      name: shopName,
      address: shopAddress,
      city: shopCity,
      category: shopCategory,
    });
    await newShop.save({ session });

    await session.commitTransaction();
    return NextResponse.json({ message: 'Vendor registered successfully. Awaiting admin approval.' }, { status: 201 });

  } catch (error: any) {
  await session.abortTransaction();
  console.error("Vendor Registration Error:", error); // Also a good idea to log the error
  return NextResponse.json({ error: error.message || 'Failed to register vendor' }, { status: 500 });
}finally {
    session.endSession();
  }
}