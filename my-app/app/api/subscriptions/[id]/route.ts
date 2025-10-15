import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const subscription = await prisma.milkSubscription.update({
      where: {
        id: id,
        customerId: session.user.id
      },
      data: body,
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Subscription updated successfully',
      subscription
    })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'CUSTOMER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = await params

    await prisma.milkSubscription.delete({
      where: {
        id: id,
        customerId: session.user.id
      }
    })

    return NextResponse.json({
      message: 'Subscription deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting subscription:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}



