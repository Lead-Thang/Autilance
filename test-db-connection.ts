import { db } from '@/lib/db'

async function testConnection() {
  try {
    // Try to connect to the database
    const users = await db.user.findMany({ take: 1 })
    console.log('Database connection successful')
    console.log(`Found ${users.length} users`)
  } catch (error) {
    console.error('Database connection failed:', error)
  }
}

testConnection()