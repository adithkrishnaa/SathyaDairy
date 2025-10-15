import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { phone, action } = await request.json()

    if (!phone) {
      return NextResponse.json(
        { message: 'Phone number is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString()
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    if (action === 'login') {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { phone }
      })

      if (!user) {
        return NextResponse.json(
          { message: 'User not found. Please register first.' },
          { status: 404 }
        )
      }

      // Update OTP for existing user
      await prisma.user.update({
        where: { phone },
        data: {
          otp,
          otpExpiresAt
        }
      })
    } else if (action === 'register') {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { phone }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: 'User already exists. Please login instead.' },
          { status: 400 }
        )
      }

      // Create new user with OTP
      await prisma.user.create({
        data: {
          phone,
          email: `${phone}@customer.local`, // Generate email from phone
          otp,
          otpExpiresAt,
          userType: 'CUSTOMER',
          name: 'New Customer', // Will be updated after OTP verification
          isVerified: false
        }
      })
    }

    // In a real app, you would send OTP via SMS service like Twilio
    // For development, we'll just return the OTP
    console.log(`OTP for ${phone}: ${otp}`)

    return NextResponse.json({
      message: 'OTP sent successfully',
      // Remove this in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    })

  } catch (error) {
    console.error('Error sending OTP:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { phone, otp, name, address, location, landmark } = await request.json()

    if (!phone || !otp) {
      return NextResponse.json(
        { message: 'Phone number and OTP are required' },
        { status: 400 }
      )
    }

    // Find user with valid OTP
    const user = await prisma.user.findUnique({
      where: { phone }
    })

    if (!user || user.otp !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { message: 'Invalid or expired OTP' },
        { status: 400 }
      )
    }

    // Update user details and mark as verified
    const updatedUser = await prisma.user.update({
      where: { phone },
      data: {
        isVerified: true,
        otp: null,
        otpExpiresAt: null,
        ...(name && { name }),
        ...(address && { address }),
        ...(location && { location }),
        ...(landmark && { landmark })
      }
    })

    return NextResponse.json({
      message: 'OTP verified successfully',
      user: {
        id: updatedUser.id,
        phone: updatedUser.phone,
        name: updatedUser.name,
        userType: updatedUser.userType,
        isVerified: updatedUser.isVerified
      }
    })

  } catch (error) {
    console.error('Error verifying OTP:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
