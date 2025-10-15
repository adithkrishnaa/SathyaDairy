import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'DELIVERY_PERSON') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, notes, deliveredAt } = body

    const delivery = await prisma.delivery.update({
      where: {
        id: params.id,
        deliveryPersonId: session.user.id
      },
      data: {
        status,
        notes,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined
      }
    })

    // Update order status if delivery is completed
    if (status === 'DELIVERED') {
      await prisma.order.update({
        where: {
          id: delivery.orderId
        },
        data: {
          status: 'DELIVERED'
        }
      })
    }

    return NextResponse.json(delivery)
  } catch (error) {
    console.error('Error updating delivery:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
