import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const normalizeDomain = (value) => {
  if (value === 'tech' || value === 'non-tech' || value === 'both') {
    return value
  }

  return 'both'
}

const getDomainMatches = (userDomain, targetDomain) => {
  const normalizedUserDomain = normalizeDomain(userDomain)
  const normalizedTargetDomain = normalizeDomain(targetDomain)

  if (normalizedTargetDomain === 'both' || normalizedUserDomain === normalizedTargetDomain) {
    return true
  }

  return false
}

const normalizeTags = (items = []) => {
  return Array.from(
    new Set(
      items
        .map((item) => String(item || '').trim().toLowerCase())
        .filter(Boolean),
    ),
  )
}

const formatOpportunity = (opportunity, currentUserId, matchScore = null) => {
  const application = opportunity.applications?.[0] || null

  return {
    id: opportunity.id,
    type: opportunity.type,
    status: opportunity.status,
    title: opportunity.title,
    companyName: opportunity.companyName,
    description: opportunity.description,
    location: opportunity.location || '',
    compensation: opportunity.compensation || '',
    deadline: opportunity.deadline,
    applicationUrl: opportunity.applicationUrl || '',
    targetDomain: normalizeDomain(opportunity.targetDomain),
    skillsRequired: opportunity.skillsRequired || [],
    appliedByMe: Boolean(application),
    applicationStatus: application?.status || null,
    applicationCount: opportunity._count?.applications || 0,
    matchScore,
    createdAt: opportunity.createdAt,
    updatedAt: opportunity.updatedAt,
    collegeId: opportunity.collegeId,
    collegeName: opportunity.college?.name || '',
    creator: buildPublicUser(opportunity.creator),
  }
}

const loadOpportunities = async ({ currentUserId, where = {}, take = 100 }) => {
  return prisma.opportunity.findMany({
    where,
    take,
    include: {
      creator: {
        include: includeUserShape,
      },
      college: true,
      applications: currentUserId
        ? {
            where: {
              applicantId: currentUserId,
            },
            select: {
              id: true,
              status: true,
              createdAt: true,
              updatedAt: true,
            },
          }
        : {
            select: {
              id: true,
              status: true,
            },
          },
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: [
      {
        createdAt: 'desc',
      },
    ],
  })
}

const scoreOpportunity = (opportunity, user) => {
  const profile = user.profile || {}
  const userSkills = normalizeTags(profile.skillTags || [])
  const opportunitySkills = normalizeTags(opportunity.skillsRequired || [])
  const sharedSkills = opportunitySkills.filter((skill) => userSkills.includes(skill))

  let score = 0

  if (user.collegeId === opportunity.collegeId) {
    score += 35
  }

  if (getDomainMatches(profile.domain, opportunity.targetDomain)) {
    score += 20
  }

  score += sharedSkills.length * 12

  if (profile.interestTags?.length) {
    const lowerInterests = normalizeTags(profile.interestTags)
    const descriptionText = `${opportunity.title} ${opportunity.description} ${opportunity.companyName}`.toLowerCase()

    const interestHits = lowerInterests.filter((interest) =>
      descriptionText.includes(interest),
    )

    score += Math.min(interestHits.length * 5, 15)
  }

  if (opportunity.type === 'INTERNSHIP' && user.role === 'STUDENT') {
    score += 10
  }

  if (opportunity.type === 'JOB' && user.role === 'ALUMNI') {
    score += 5
  }

  return Math.min(score, 100)
}

export const createOpportunity = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { role } = req.user || {}
  const {
    type,
    title,
    companyName,
    description,
    location,
    compensation,
    applicationUrl,
    deadline,
    targetDomain,
    skillsRequired = [],
  } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  if (role !== 'ALUMNI' && role !== 'ADMIN') {
    throw new AppError('Only alumni can post opportunities.', 403)
  }

  const creator = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      collegeId: true,
    },
  })

  if (!creator) {
    throw new AppError('Creator not found.', 404)
  }

  const created = await prisma.opportunity.create({
    data: {
      creatorId: currentUserId,
      collegeId: creator.collegeId,
      type,
      title,
      companyName,
      description,
      location: location || null,
      compensation: compensation || null,
      applicationUrl: applicationUrl || null,
      deadline: deadline ? new Date(deadline) : null,
      targetDomain: normalizeDomain(targetDomain),
      skillsRequired: normalizeTags(skillsRequired),
    },
    include: {
      creator: {
        include: includeUserShape,
      },
      college: true,
      applications: {
        select: {
          id: true,
          status: true,
        },
      },
      _count: {
        select: {
          applications: true,
        },
      },
    },
  })

  return sendSuccess(
    res,
    {
      message: 'Opportunity posted successfully.',
      opportunity: formatOpportunity(created, currentUserId),
    },
    201,
  )
})

export const getOpportunities = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const type = String(req.query.type || '').trim().toUpperCase()
  const status = String(req.query.status || '').trim().toUpperCase()

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const where = {
    ...(type && ['JOB', 'INTERNSHIP', 'EVENT'].includes(type)
      ? { type }
      : {}),
    ...(status && ['ACTIVE', 'CLOSED'].includes(status) ? { status } : { status: 'ACTIVE' }),
  }

  const opportunities = await loadOpportunities({
    currentUserId,
    where,
  })

  return sendSuccess(res, {
    opportunities: opportunities.map((opportunity) =>
      formatOpportunity(opportunity, currentUserId),
    ),
  })
})

export const applyToOpportunity = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { opportunityId } = req.params
  const { coverNote } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    select: {
      id: true,
      role: true,
    },
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  if (user.role !== 'STUDENT') {
    throw new AppError('Only students can apply for opportunities.', 403)
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: {
      id: opportunityId,
    },
    select: {
      id: true,
      status: true,
    },
  })

  if (!opportunity) {
    throw new AppError('Opportunity not found.', 404)
  }

  if (opportunity.status !== 'ACTIVE') {
    throw new AppError('This opportunity is no longer accepting applications.', 409)
  }

  const application = await prisma.opportunityApplication.upsert({
    where: {
      opportunityId_applicantId: {
        opportunityId,
        applicantId: currentUserId,
      },
    },
    create: {
      opportunityId,
      applicantId: currentUserId,
      coverNote: coverNote || null,
      status: 'APPLIED',
    },
    update: {
      coverNote: coverNote || null,
      status: 'APPLIED',
    },
  })

  return sendSuccess(res, {
    message: 'Application submitted successfully.',
    application,
  })
})

export const getOpportunityMatches = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUserId,
    },
    include: {
      college: true,
      profile: true,
    },
  })

  if (!user) {
    throw new AppError('User not found.', 404)
  }

  const opportunities = await loadOpportunities({
    currentUserId,
    where: {
      status: 'ACTIVE',
    },
    take: 100,
  })

  const ranked = opportunities
    .map((opportunity) => ({
      ...opportunity,
      matchScore: scoreOpportunity(opportunity, user),
    }))
    .sort((left, right) => right.matchScore - left.matchScore)

  return sendSuccess(res, {
    opportunities: ranked.map((opportunity) =>
      formatOpportunity(opportunity, currentUserId, opportunity.matchScore),
    ),
  })
})
