import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const subscriptions = await prisma.milkSubscription.findMany({
      where: {
        customerId: session.user.id
      },
      include: {
        product: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(subscriptions)
  } catch (error) {
    console.error('Error fetching subscriptions:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity, startDate, endDate, leaveDates } = body

    const subscription = await prisma.milkSubscription.create({
      data: {
        customerId: session.user.id,
        productId,
        quantity: parseFloat(quantity),
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        leaveDates: leaveDates || [],
        isActive: true
      },
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}



