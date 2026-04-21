import { Router } from 'express'

import { prisma } from '../config/prisma.js'
import { AppError } from '../utils/app-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import { sendSuccess } from '../utils/api-response.js'
import { ensureCollegeForSignup } from '../services/location.service.js'

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

const normalizeId = (value = '') => String(value || '').trim()

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rawState = String(req.query.state || '')
    const state = normalizeStateInput(rawState)
    const stateId = normalizeId(req.query.stateId)
    const districtId = normalizeId(req.query.districtId)

    if (districtId) {
      const colleges = await prisma.college.findMany({
        where: {
          districtId,
        },
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

      return sendSuccess(res, { colleges })
    }

    if (stateId) {
      const colleges = await prisma.college.findMany({
        where: {
          stateId,
        },
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

      return sendSuccess(res, { colleges })
    }

    if (!state) {
      const allColleges = await prisma.college.findMany({
        select: {
          id: true,
          name: true,
          state: true,
          district: true,
          stateId: true,
          districtId: true,
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
        district: true,
        stateId: true,
        districtId: true,
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
    const stateName = sanitizeCollegeName(String(req.body?.stateName || req.body?.state || ''))
    const districtName = sanitizeCollegeName(
      String(req.body?.districtName || req.body?.district || ''),
    )
    const stateId = normalizeId(req.body?.stateId)
    const districtId = normalizeId(req.body?.districtId)
    const emailDomain = String(req.body?.emailDomain || '').trim().toLowerCase() || null

    if (!name) {
      throw new AppError('College name is required.', 400)
    }

    const createdCollege = await ensureCollegeForSignup({
      collegeName: name,
      stateId: stateId || null,
      stateName: state || stateName || null,
      districtId: districtId || null,
      districtName: districtName || null,
      emailDomain,
    })

    return sendSuccess(
      res,
      {
        message: 'College added successfully.',
        college: {
          id: createdCollege.id,
          name: createdCollege.name,
          state: createdCollege.state || null,
          district: createdCollege.district || null,
          stateId: createdCollege.stateId || null,
          districtId: createdCollege.districtId || null,
        },
      },
      201,
    )
  }),
)

export default router
