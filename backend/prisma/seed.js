import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const collegeSeeds = [
  { name: 'IIT Indore', emailDomain: 'iiti.ac.in', city: 'Indore', state: 'Madhya Pradesh' },
  { name: 'IIT Bombay', emailDomain: 'iitb.ac.in', city: 'Mumbai', state: 'Maharashtra' },
  { name: 'IIT Delhi', emailDomain: 'iitd.ac.in', city: 'New Delhi', state: 'Delhi' },
  { name: 'IIM Ahmedabad', emailDomain: 'iima.ac.in', city: 'Ahmedabad', state: 'Gujarat' },
  { name: 'AlumniConnect Demo College', emailDomain: 'alumni.edu', city: 'Remote', state: 'Virtual' },
]

async function main() {
  for (const college of collegeSeeds) {
    await prisma.college.upsert({
      where: { emailDomain: college.emailDomain },
      update: {
        name: college.name,
        city: college.city,
        state: college.state,
      },
      create: college,
    })
  }

  console.log(`[seed] inserted/updated ${collegeSeeds.length} colleges`)
}

main()
  .catch((error) => {
    console.error('[seed] failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
