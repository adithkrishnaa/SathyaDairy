import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.userType !== 'OWNER') {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const deliveries = await prisma.delivery.findMany({
      where: {
        order: {
          items: {
            some: {
              product: {
                ownerId: session.user.id
              }
            }
          }
        }
      },
      include: {
        order: {
          include: {
            customer: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        deliveryPerson: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        scheduledDate: 'desc'
      }
    })

    return NextResponse.json(deliveries)
  } catch (error) {
    console.error('Error fetching owner deliveries:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
