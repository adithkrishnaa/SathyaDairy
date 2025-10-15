import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'DELIVERY_PERSON') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { cashReceived, paymentMethod } = body

    // Update delivery with cash collection
    const delivery = await prisma.delivery.update({
      where: {
        id: id,
        deliveryPersonId: session.user.id
      },
      data: {
        cashReceived: cashReceived,
        paymentMethod: paymentMethod
      },
      include: {
        order: {
          include: {
            customer: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cash collection recorded successfully',
      delivery
    })
  } catch (error) {
    console.error('Error recording cash collection:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}



