import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const locationSeeds = [
  {
    name: 'Delhi',
    code: 'DL',
    districts: [
      { name: 'New Delhi', code: 'NEW-DELHI' },
      { name: 'South West Delhi', code: 'SOUTH-WEST-DELHI' },
    ],
  },
  {
    name: 'Gujarat',
    code: 'GJ',
    districts: [{ name: 'Ahmedabad', code: 'AHMEDABAD' }],
  },
  {
    name: 'Madhya Pradesh',
    code: 'MP',
    districts: [
      { name: 'Bhopal', code: 'BHOPAL' },
      { name: 'Indore', code: 'INDORE' },
    ],
  },
  {
    name: 'Maharashtra',
    code: 'MH',
    districts: [
      { name: 'Mumbai', code: 'MUMBAI' },
      { name: 'Pune', code: 'PUNE' },
    ],
  },
]

const collegeSeeds = [
  {
    name: 'IIT Indore',
    emailDomain: 'iiti.ac.in',
    city: 'Indore',
    state: 'Madhya Pradesh',
    district: 'Indore',
  },
  {
    name: 'IIT Bombay',
    emailDomain: 'iitb.ac.in',
    city: 'Mumbai',
    state: 'Maharashtra',
    district: 'Mumbai',
  },
  {
    name: 'IIT Delhi',
    emailDomain: 'iitd.ac.in',
    city: 'New Delhi',
    state: 'Delhi',
    district: 'New Delhi',
  },
  {
    name: 'IIM Ahmedabad',
    emailDomain: 'iima.ac.in',
    city: 'Ahmedabad',
    state: 'Gujarat',
    district: 'Ahmedabad',
  },
]

async function upsertLocations() {
  for (const state of locationSeeds) {
    const createdState = await prisma.locationState.upsert({
      where: { name: state.name },
      update: {
        code: state.code,
      },
      create: {
        name: state.name,
        code: state.code,
      },
    })

    for (const district of state.districts) {
      await prisma.locationDistrict.upsert({
        where: {
          stateId_name: {
            stateId: createdState.id,
            name: district.name,
          },
        },
        update: {
          code: district.code,
        },
        create: {
          stateId: createdState.id,
          name: district.name,
          code: district.code,
        },
      })
    }
  }
}

async function upsertColleges() {
  for (const college of collegeSeeds) {
    const state = await prisma.locationState.findUnique({
      where: {
        name: college.state,
      },
    })

    const district = state
      ? await prisma.locationDistrict.findFirst({
          where: {
            stateId: state.id,
            name: college.district,
          },
        })
      : null

    await prisma.college.upsert({
      where: { emailDomain: college.emailDomain },
      update: {
        name: college.name,
        city: college.city,
        state: college.state,
        district: college.district,
        stateId: state?.id || null,
        districtId: district?.id || null,
      },
      create: {
        name: college.name,
        emailDomain: college.emailDomain,
        city: college.city,
        state: college.state,
        district: college.district,
        stateId: state?.id || null,
        districtId: district?.id || null,
      },
    })
  }
}

async function main() {
  await upsertLocations()
  await upsertColleges()

  console.log(
    `[seed] inserted/updated ${locationSeeds.length} states and ${collegeSeeds.length} colleges`,
  )
}

main()
  .catch((error) => {
    console.error('[seed] failed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
