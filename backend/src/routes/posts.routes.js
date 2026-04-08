import { Router } from 'express'

import { createPost, getPosts } from '../controllers/posts.controller.js'
import { requireAuth } from '../middlewares/auth.middleware.js'
import { validate } from '../middlewares/validate.middleware.js'
import { createPostSchema } from '../validations/post.validation.js'

const router = Router()

router.get('/posts', requireAuth, getPosts)
router.post('/post', requireAuth, validate(createPostSchema), createPost)

export default router
