import { db } from './lib/db'

console.log('Prisma client keys:', Object.keys(db))
console.log('Offer model exists:', typeof db.offer !== 'undefined')