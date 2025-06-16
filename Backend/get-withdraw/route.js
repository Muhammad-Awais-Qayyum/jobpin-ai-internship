import Withdrawal from "@/app/models/withdrawal";
import connectDB from "@/lib/mongodb";
import jwt from 'jsonwebtoken'
import { NextResponse } from "next/server";
 





export async function GET(request) {
  try {
    await connectDB();
    
    const authToken = request.cookies.get('authToken')?.value;

    if (!authToken) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
    
    const userId = decoded?.userId;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token payload' },
        { status: 401 }
      );
    }

    // Find user's withdrawal history
    const withdrawals = await Withdrawal.find({ userId }).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: withdrawals
    });
    
  } catch (error) {
    console.error("Error fetching withdrawal history:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}