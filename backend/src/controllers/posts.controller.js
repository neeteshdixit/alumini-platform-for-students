import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const formatPost = (post) => {
  return {
    id: post.id,
    type: post.type,
    title: post.title,
    description: post.description,
    attachmentUrl: post.attachmentUrl,
    createdAt: post.createdAt,
    author: buildPublicUser(post.author),
  }
}

export const createPost = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { type, title, description, attachmentUrl } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const created = await prisma.post.create({
    data: {
      authorId: currentUserId,
      type,
      title,
      description,
      attachmentUrl: attachmentUrl || null,
    },
    include: {
      author: {
        include: includeUserShape,
      },
    },
  })

  return sendSuccess(
    res,
    {
      message: 'Post published successfully.',
      post: formatPost(created),
    },
    201,
  )
})

export const getPosts = asyncHandler(async (req, res) => {
  const limitRaw = Number(req.query.limit || 30)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 30

  const posts = await prisma.post.findMany({
    take: limit,
    include: {
      author: {
        include: includeUserShape,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return sendSuccess(res, {
    posts: posts.map(formatPost),
  })
})
