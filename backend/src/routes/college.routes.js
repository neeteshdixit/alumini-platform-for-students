import { Router } from 'express'

import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { sendSuccess } from '../utils/api-response.js'

const router = Router()

const stateAliases = {
  mp: 'Madhya Pradesh',
  mh: 'Maharashtra',
  dl: 'Delhi',
  del: 'Delhi',
}

const normalizeStateInput = (state = '') => {
  const compact = state.trim()
  if (!compact) {
    return ''
  }

  const lower = compact.toLowerCase()
  if (stateAliases[lower]) {
    return stateAliases[lower]
  }

  return compact
}

const sanitizeCollegeName = (name = '') => {
  return name.trim().replace(/\s+/g, ' ')
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rawState = String(req.query.state || '')
    const state = normalizeStateInput(rawState)

    if (!state) {
      const allColleges = await prisma.college.findMany({
        select: {
          id: true,
          name: true,
          state: true,
        },
        orderBy: [{ state: 'asc' }, { name: 'asc' }],
      })

      return sendSuccess(res, { colleges: allColleges })
    }

    const colleges = await prisma.college.findMany({
      where: {
        state: {
          equals: state,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        state: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

    return sendSuccess(res, { colleges })
  }),
)

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const name = sanitizeCollegeName(String(req.body?.name || ''))
    const state = normalizeStateInput(String(req.body?.state || ''))

    if (!name || !state) {
      throw new AppError('College name and state are required.', 400)
    }

    const duplicate = await prisma.college.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        state: {
          equals: state,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
      },
    })

    if (duplicate) {
      throw new AppError('College already exists for this state.', 409)
    }

    const createdCollege = await prisma.college.create({
      data: {
        name,
        state,
      },
      select: {
        id: true,
        name: true,
        state: true,
      },
    })

    return sendSuccess(
      res,
      {
        message: 'College added successfully.',
        college: createdCollege,
      },
      201,
    )
  }),
)

export default router
