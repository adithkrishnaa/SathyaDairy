const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function seedDatabase() {
  try {
    console.log('Starting database seed...')
    
    // Create default users
    const hashedPassword = await bcrypt.hash('password123', 12)
    
    // Create a default owner
    const owner = await prisma.user.upsert({
      where: { email: 'owner@sathyadairy.com' },
      update: {},
      create: {
        email: 'owner@sathyadairy.com',
        password: hashedPassword,
        name: 'Dairy Owner',
        userType: 'OWNER',
        phone: '+91 9876543210',
        address: '123 Dairy Street, City'
      }
    })

    // Create a default customer
    const customer = await prisma.user.upsert({
      where: { email: 'customer@sathyadairy.com' },
      update: {},
      create: {
        email: 'customer@sathyadairy.com',
        password: hashedPassword,
        name: 'John Customer',
        userType: 'CUSTOMER',
        phone: '+91 9876543211',
        address: '456 Customer Lane, City'
      }
    })

    // Create a default delivery person
    const deliveryPerson = await prisma.user.upsert({
      where: { email: 'delivery@sathyadairy.com' },
      update: {},
      create: {
        email: 'delivery@sathyadairy.com',
        password: hashedPassword,
        name: 'Delivery Person',
        userType: 'DELIVERY_PERSON',
        phone: '+91 9876543212',
        address: '789 Delivery Road, City'
      }
    })

    // Create sample products
    const products = [
      {
        name: 'Fresh Cow Milk',
        description: 'Pure, fresh cow milk delivered daily',
        price: 60.00,
        category: 'Milk',
        ownerId: owner.id
      },
      {
        name: 'Buffalo Milk',
        description: 'Rich and creamy buffalo milk',
        price: 70.00,
        category: 'Milk',
        ownerId: owner.id
      },
      {
        name: 'Fresh Curd',
        description: 'Homemade fresh curd',
        price: 40.00,
        category: 'Curd',
        ownerId: owner.id
      },
      {
        name: 'Butter',
        description: 'Pure homemade butter',
        price: 200.00,
        category: 'Butter',
        ownerId: owner.id
      }
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { 
          id: product.name + '-' + product.ownerId // Use a simple unique identifier
        },
        update: {},
        create: {
          ...product,
          id: product.name + '-' + product.ownerId
        }
      })
    }

    console.log('Database seeded successfully!')
    console.log('Default credentials:')
    console.log('Owner: owner@sathyadairy.com / password123')
    console.log('Customer: customer@sathyadairy.com / password123')
    console.log('Delivery: delivery@sathyadairy.com / password123')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDatabase()
