import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // Attempt to connect to the database
    await prisma.$connect()
    console.log('✅ Successfully connected to the database')
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT current_timestamp;`
    console.log('✅ Successfully executed test query:', result)
    
  } catch (error) {
    console.error('❌ Error connecting to the database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 