import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.userType !== 'ADMIN' && session.user.userType !== 'DELIVERY_PERSON')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const customers = await prisma.user.findMany({
      where: {
        userType: 'CUSTOMER'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        location: true,
        landmark: true,
        isVerified: true,
        createdAt: true
      }
    })

    return NextResponse.json(customers)
  } catch (error) {
    console.error('Error fetching customers:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || (session.user.userType !== 'ADMIN' && session.user.userType !== 'DELIVERY_PERSON')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, address, location, landmark } = body

    // Check if customer already exists
    const existingCustomer = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: phone },
          { email: `${phone}@customer.local` } // Generate email from phone
        ]
      }
    })

    if (existingCustomer) {
      return NextResponse.json(
        { message: 'Customer already exists with this phone number' },
        { status: 400 }
      )
    }

    // Create new customer
    const customer = await prisma.user.create({
      data: {
        name,
        phone,
        email: `${phone}@customer.local`, // Generate email from phone
        address,
        location,
        landmark,
        userType: 'CUSTOMER',
        isVerified: true
      }
    })

    return NextResponse.json({
      message: 'Customer created successfully',
      customer: {
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        location: customer.location,
        landmark: customer.landmark
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating customer:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}



