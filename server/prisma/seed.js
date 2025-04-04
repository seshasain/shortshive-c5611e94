
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')
  
  // Create a test profile if it doesn't exist
  const testProfile = await prisma.profile.upsert({
    where: { id: 'mock-user-id' },
    update: {},
    create: {
      id: 'mock-user-id',
      name: 'Test User',
      full_name: 'Test User',
      country: 'United States',
      profession: 'Developer',
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  
  console.log('Created test profile:', testProfile)
  
  // Create a test animation
  const testAnimation = await prisma.animation.upsert({
    where: { id: 'mock-animation-1' },
    update: {},
    create: {
      id: 'mock-animation-1', 
      user_id: 'mock-user-id',
      title: 'Test Animation',
      description: 'This is a test animation',
      status: 'completed',
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  
  console.log('Created test animation:', testAnimation)
  
  // Create a test story
  const testStory = await prisma.story.upsert({
    where: { id: 'mock-story-1' },
    update: {},
    create: {
      id: 'mock-story-1',
      user_id: 'mock-user-id',
      title: 'Test Story',
      content: 'Once upon a time...',
      settings: {},
      created_at: new Date(),
      updated_at: new Date()
    }
  })
  
  console.log('Created test story:', testStory)
  
  console.log('Database seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
