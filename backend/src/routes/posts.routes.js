import { Router } from 'express'

import {
  addPostComment,
  createPost,
  getPosts,
  sharePost,
  togglePostLike,
} from '../controllers/posts.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import {
  addCommentSchema,
  createPostSchema,
} from '../validations/post.validation.js'

const router = Router()

router.get('/posts', requireAuth, getPosts)
router.post('/post', requireAuth, validate(createPostSchema), createPost)
router.post('/posts/:postId/like', requireAuth, togglePostLike)
router.post(
  '/posts/:postId/comment',
  requireAuth,
  validate(addCommentSchema),
  addPostComment,
)
router.post('/posts/:postId/share', requireAuth, sharePost)

export default router
