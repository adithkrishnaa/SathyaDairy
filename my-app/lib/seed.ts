import { prisma } from './db'
import bcrypt from 'bcryptjs'

export async function seedDatabase() {
  try {
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
        address: '123 Dairy Street, City',
        isVerified: true
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
        address: '456 Customer Lane, City',
        location: 'Sector 15, Noida',
        landmark: 'Near Metro Station',
        isVerified: true
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
        address: '789 Delivery Road, City',
        isVerified: true
      }
    })

    // Create a default admin
    const admin = await prisma.user.upsert({
      where: { email: 'admin@sathyadairy.com' },
      update: {},
      create: {
        email: 'admin@sathyadairy.com',
        password: hashedPassword,
        name: 'System Administrator',
        userType: 'ADMIN',
        phone: '+91 9876543213',
        address: 'Admin Office, Sathya Dairy',
        isVerified: true
      }
    })

    // Create sample products
    const products = [
      {
        name: 'Fresh Cow Milk',
        description: 'Pure, fresh cow milk delivered daily',
        price: 60.00,
        category: 'Milk',
        stock: 100.0,
        ownerId: owner.id
      },
      {
        name: 'Buffalo Milk',
        description: 'Rich and creamy buffalo milk',
        price: 70.00,
        category: 'Milk',
        stock: 50.0,
        ownerId: owner.id
      },
      {
        name: 'Fresh Curd',
        description: 'Homemade fresh curd',
        price: 40.00,
        category: 'Curd',
        stock: 30.0,
        ownerId: owner.id
      },
      {
        name: 'Butter',
        description: 'Pure homemade butter',
        price: 200.00,
        category: 'Butter',
        stock: 20.0,
        ownerId: owner.id
      }
    ]

    for (const product of products) {
      await prisma.product.upsert({
        where: { 
          id: `${product.name}-${product.ownerId}`
        },
        update: {},
        create: {
          ...product,
          id: `${product.name}-${product.ownerId}`
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
  }
}
