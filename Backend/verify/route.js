// app/api/auth/verify/route.js
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/app/models/User'

export async function POST(request) {
  try {
    await connectDB()
    
    const { email, code } = await request.json()
    
    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and verification code are required' },
        { status: 400 }
      )
    }
    
    const user = await User.findOne({ email })
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }
    
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Account is already verified' },
        { status: 400 }
      )
    }
    
    if (user.verificationCode !== code) {
      return NextResponse.json(
        { success: false, message: 'Invalid verification code' },
        { status: 400 }
      )
    }
    
    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json(
        { success: false, message: 'Verification code has expired' },
        { status: 400 }
      )
    }
    
    // Update user as verified
    user.isVerified = true
    user.verificationCode = undefined
    user.verificationCodeExpires = undefined
    await user.save()
    
    return NextResponse.json({
      success: true,
      message: 'Email verified successfully!'
    })
    
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Verification failed. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}