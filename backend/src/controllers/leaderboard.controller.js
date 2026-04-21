import { prisma } from '../config/prisma.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { AppError } from '../utils/app-error.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const scoreMentor = (user) => {
  const counts = user._count || {}
  const mentorships = Number(counts.mentorshipsAsMentor || 0)
  const posts = Number(counts.posts || 0)
  const comments = Number(counts.postComments || 0)
  const connections = Number(counts.sentConnectionRequests || 0)

  return mentorships * 6 + posts * 4 + comments * 2 + connections
}

const scoreAlumni = (user) => {
  const counts = user._count || {}
  const posts = Number(counts.posts || 0)
  const comments = Number(counts.postComments || 0)
  const shares = Number(counts.postShares || 0)
  const mentorships = Number(counts.mentorshipsAsMentor || 0)

  return posts * 5 + comments * 2 + shares * 2 + mentorships * 4
}

const mapLeaderboardUser = (user, score) => ({
  ...buildPublicUser(user),
  activityScore: score,
})

export const getLeaderboard = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const [mentors, alumni] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: 'ALUMNI',
        profile: {
          is: {
            openToMentorship: true,
          },
        },
      },
      include: {
        ...includeUserShape,
        _count: {
          select: {
            mentorshipsAsMentor: true,
            posts: true,
            postComments: true,
            sentConnectionRequests: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
    prisma.user.findMany({
      where: {
        role: 'ALUMNI',
      },
      include: {
        ...includeUserShape,
        _count: {
          select: {
            posts: true,
            postComments: true,
            postShares: true,
            mentorshipsAsMentor: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    }),
  ])

  return sendSuccess(res, {
    topMentors: mentors
      .map((user) => mapLeaderboardUser(user, scoreMentor(user)))
      .sort((left, right) => right.activityScore - left.activityScore)
      .slice(0, 10),
    mostActiveAlumni: alumni
      .map((user) => mapLeaderboardUser(user, scoreAlumni(user)))
      .sort((left, right) => right.activityScore - left.activityScore)
      .slice(0, 10),
  })
})
