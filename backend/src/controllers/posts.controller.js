import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { sendSuccess } from '../utils/api-response.js'
import { asyncHandler } from '../utils/async-handler.js'
import { buildPublicUser } from '../services/user-presenter.service.js'

const includeUserShape = {
  college: true,
  profile: true,
}

const normalizeMediaUrls = ({ attachmentUrl, mediaUrls }) => {
  const urls = []

  if (Array.isArray(mediaUrls)) {
    urls.push(...mediaUrls)
  }

  if (attachmentUrl) {
    urls.push(attachmentUrl)
  }

  return Array.from(
    new Set(
      urls
        .map((value) => String(value || '').trim())
        .filter(Boolean),
    ),
  )
}

const inferFileTypeFromUrl = (url) => {
  const normalized = String(url || '').trim().toLowerCase()

  if (normalized.endsWith('.pdf')) {
    return 'pdf'
  }

  if (/\.(png|jpe?g|webp|gif|bmp|svg)(\?|#|$)/i.test(normalized)) {
    return 'image'
  }

  return 'file'
}

const normalizePostFiles = (files = []) => {
  const normalized = []

  for (const file of Array.isArray(files) ? files : []) {
    const url = String(file?.url || '').trim()
    if (!url) continue

    const fileType = String(file?.fileType || inferFileTypeFromUrl(url)).trim().toLowerCase() || 'file'
    const fileName = String(file?.fileName || '').trim() || null
    const fileSizeValue = Number(file?.fileSize)
    const fileSize = Number.isFinite(fileSizeValue) && fileSizeValue >= 0 ? Math.floor(fileSizeValue) : null
    const mimeType = String(file?.mimeType || '').trim() || null

    normalized.push({
      url,
      fileType,
      fileName,
      fileSize,
      mimeType,
    })
  }

  return Array.from(new Map(normalized.map((file) => [file.url, file])).values())
}

const formatPostFile = (file) => {
  return {
    id: file.id,
    url: file.url,
    fileType: file.fileType || inferFileTypeFromUrl(file.url),
    fileName: file.fileName || null,
    fileSize: typeof file.fileSize === 'number' ? file.fileSize : null,
    mimeType: file.mimeType || null,
    createdAt: file.createdAt,
  }
}

const formatComment = (comment) => {
  return {
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    author: buildPublicUser(comment.user),
  }
}

const formatPost = (post) => {
  const files = (post.files || []).map(formatPostFile)

  return {
    id: post.id,
    type: post.type,
    title: post.title,
    description: post.description,
    attachmentUrl: post.attachmentUrl,
    mediaUrls: post.mediaUrls || [],
    fileUrl: post.fileUrl || files[0]?.url || null,
    fileType: post.fileType || files[0]?.fileType || null,
    files,
    likeCount: post.likeCount,
    commentCount: post.commentCount,
    shareCount: post.shareCount,
    likedByMe: Boolean(post.likes?.length),
    comments: (post.comments || []).slice().reverse().map(formatComment),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    author: buildPublicUser(post.author),
  }
}

const resolvePostTitle = (title, description) => {
  const fallback = String(description || '')
    .trim()
    .slice(0, 60)
    .trim()

  return String(title || fallback || 'Alumni post').trim()
}

const loadPostWithContext = async ({ postId, currentUserId }) => {
  return prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        include: includeUserShape,
      },
      files: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      likes: currentUserId
        ? {
            where: {
              userId: currentUserId,
            },
            select: {
              userId: true,
            },
          }
        : {
            select: {
              userId: true,
            },
          },
      comments: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            include: includeUserShape,
          },
        },
      },
    },
  })
}

export const createPost = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { type, title, description, attachmentUrl, mediaUrls = [], files = [] } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const media = normalizeMediaUrls({
    attachmentUrl,
    mediaUrls,
  })

  const normalizedFiles = normalizePostFiles(files)

  const created = await prisma.post.create({
    data: {
      authorId: currentUserId,
      type,
      title: resolvePostTitle(title, description),
      description,
      attachmentUrl: attachmentUrl || null,
      mediaUrls: media,
      fileUrl: normalizedFiles[0]?.url || null,
      fileType: normalizedFiles[0]?.fileType || null,
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      ...(normalizedFiles.length
        ? {
            files: {
              create: normalizedFiles,
            },
          }
        : {}),
    },
    include: {
      author: {
        include: includeUserShape,
      },
      files: {
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
  })

  return sendSuccess(
    res,
    {
      message: 'Post published successfully.',
      post: {
        ...formatPost({
          ...created,
          likes: [],
          comments: [],
        }),
      },
    },
    201,
  )
})

export const getPosts = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const limitRaw = Number(req.query.limit || 30)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 100) : 30

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const posts = await prisma.post.findMany({
    take: limit,
    include: {
      author: {
        include: includeUserShape,
      },
      files: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      likes: {
        where: {
          userId: currentUserId,
        },
        select: {
          userId: true,
        },
      },
      comments: {
        take: 3,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            include: includeUserShape,
          },
        },
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

export const togglePostLike = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { postId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      likeCount: true,
    },
  })

  if (!post) {
    throw new AppError('Post not found.', 404)
  }

  const existingLike = await prisma.postLike.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: currentUserId,
      },
    },
  })

  let liked = true

  if (existingLike) {
    await prisma.$transaction([
      prisma.postLike.delete({
        where: {
          postId_userId: {
            postId,
            userId: currentUserId,
          },
        },
      }),
      prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      }),
    ])

    liked = false
  } else {
    await prisma.$transaction([
      prisma.postLike.create({
        data: {
          postId,
          userId: currentUserId,
        },
      }),
      prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likeCount: {
            increment: 1,
          },
        },
      }),
    ])
  }

  const refreshed = await loadPostWithContext({
    postId,
    currentUserId,
  })

  return sendSuccess(res, {
    message: liked ? 'Post liked.' : 'Post unliked.',
    post: formatPost(refreshed),
  })
})

export const addPostComment = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { postId } = req.params
  const { content } = req.body

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  })

  if (!post) {
    throw new AppError('Post not found.', 404)
  }

  const comment = await prisma.$transaction(async (tx) => {
    const createdComment = await tx.postComment.create({
      data: {
        postId,
        userId: currentUserId,
        content,
      },
      include: {
        user: {
          include: includeUserShape,
        },
      },
    })

    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    })

    return createdComment
  })

  const refreshed = await loadPostWithContext({
    postId,
    currentUserId,
  })

  return sendSuccess(res, {
    message: 'Comment added successfully.',
    comment: formatComment(comment),
    post: formatPost(refreshed),
  })
})

export const sharePost = asyncHandler(async (req, res) => {
  const currentUserId = req.user?.userId
  const { postId } = req.params

  if (!currentUserId) {
    throw new AppError('Unauthorized.', 401)
  }

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
    },
  })

  if (!post) {
    throw new AppError('Post not found.', 404)
  }

  await prisma.$transaction(async (tx) => {
    const existingShare = await tx.postShare.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: currentUserId,
        },
      },
    })

    if (existingShare) {
      return existingShare
    }

    await tx.postShare.create({
      data: {
        postId,
        userId: currentUserId,
      },
    })

    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        shareCount: {
          increment: 1,
        },
      },
    })
  })

  const refreshed = await loadPostWithContext({
    postId,
    currentUserId,
  })

  return sendSuccess(res, {
    message: 'Post shared successfully.',
    post: formatPost(refreshed),
  })
})
