import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'

const normalizeName = (value) => {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
}

const toCode = (value) => {
  return normalizeName(value)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const resolveState = async ({ stateId, stateName }) => {
  if (stateId) {
    const state = await prisma.locationState.findUnique({
      where: { id: stateId },
    })

    if (!state) {
      throw new AppError('Invalid stateId.', 400)
    }

    return state
  }

  const normalizedName = normalizeName(stateName)
  if (!normalizedName) {
    return null
  }

  const existing = await prisma.locationState.findFirst({
    where: {
      name: {
        equals: normalizedName,
        mode: 'insensitive',
      },
    },
  })

  if (existing) {
    return existing
  }

  return prisma.locationState.create({
    data: {
      name: normalizedName,
      code: toCode(normalizedName),
    },
  })
}

const resolveDistrict = async ({ districtId, districtName, state }) => {
  if (districtId) {
    const district = await prisma.locationDistrict.findUnique({
      where: { id: districtId },
      include: {
        state: true,
      },
    })

    if (!district) {
      throw new AppError('Invalid districtId.', 400)
    }

    if (state && district.stateId !== state.id) {
      throw new AppError('District does not belong to the selected state.', 400)
    }

    return district
  }

  const normalizedName = normalizeName(districtName)
  if (!normalizedName) {
    return null
  }

  if (!state) {
    throw new AppError('stateId or stateName is required to resolve district.', 400)
  }

  const existing = await prisma.locationDistrict.findFirst({
    where: {
      stateId: state.id,
      name: {
        equals: normalizedName,
        mode: 'insensitive',
      },
    },
  })

  if (existing) {
    return existing
  }

  return prisma.locationDistrict.create({
    data: {
      stateId: state.id,
      name: normalizedName,
      code: toCode(normalizedName),
    },
    include: {
      state: true,
    },
  })
}

export const ensureLocationHierarchy = async ({
  stateId,
  stateName,
  districtId,
  districtName,
}) => {
  const state = await resolveState({
    stateId,
    stateName,
  })

  const district = await resolveDistrict({
    districtId,
    districtName,
    state,
  })

  return {
    state,
    district,
  }
}

export const ensureCollegeForSignup = async ({
  collegeId,
  collegeName,
  stateId,
  stateName,
  districtId,
  districtName,
  emailDomain,
}) => {
  if (collegeId) {
    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: {
        stateLocation: true,
        districtLocation: true,
      },
    })

    if (!college) {
      throw new AppError('Invalid collegeId.', 400)
    }

    return college
  }

  const normalizedCollegeName = normalizeName(collegeName)
  if (!normalizedCollegeName) {
    throw new AppError('collegeId or collegeName is required.', 400)
  }

  const { state, district } = await ensureLocationHierarchy({
    stateId,
    stateName,
    districtId,
    districtName,
  })

  const collegeWhere = {
    name: {
      equals: normalizedCollegeName,
      mode: 'insensitive',
    },
  }

  if (district?.id) {
    collegeWhere.districtId = district.id
  } else if (state?.id) {
    collegeWhere.stateId = state.id
  }

  const existingCollege = await prisma.college.findFirst({
    where: collegeWhere,
    include: {
      stateLocation: true,
      districtLocation: true,
    },
  })

  if (existingCollege) {
    return existingCollege
  }

  return prisma.college.create({
    data: {
      name: normalizedCollegeName,
      state: state?.name || normalizeName(stateName) || null,
      district: district?.name || normalizeName(districtName) || null,
      stateId: state?.id || null,
      districtId: district?.id || null,
      emailDomain: emailDomain || null,
    },
    include: {
      stateLocation: true,
      districtLocation: true,
    },
  })
}

export const listStates = async () => {
  return prisma.locationState.findMany({
    select: {
      id: true,
      name: true,
      code: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export const listDistricts = async ({ stateId }) => {
  if (!stateId) {
    return []
  }

  return prisma.locationDistrict.findMany({
    where: {
      stateId,
    },
    select: {
      id: true,
      name: true,
      code: true,
      stateId: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}

export const listCollegesByDistrict = async ({ districtId }) => {
  const where = districtId
    ? {
        districtId,
      }
    : {}

  return prisma.college.findMany({
    where,
    select: {
      id: true,
      name: true,
      state: true,
      district: true,
      stateId: true,
      districtId: true,
    },
    orderBy: {
      name: 'asc',
    },
  })
}
