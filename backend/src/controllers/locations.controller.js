import { asyncHandler } from '../utils/async-handler.js'
import { sendSuccess } from '../utils/api-response.js'
import { AppError } from '../utils/app-error.js'
import {
  listCollegesByDistrict,
  listDistricts,
  listStates,
} from '../services/location.service.js'

export const getLocationStates = asyncHandler(async (_req, res) => {
  const states = await listStates()

  return sendSuccess(res, {
    states,
  })
})

export const getLocationDistricts = asyncHandler(async (req, res) => {
  const stateId = String(req.query.stateId || '').trim()

  if (!stateId) {
    throw new AppError('stateId is required.', 400)
  }

  const districts = await listDistricts({ stateId })

  return sendSuccess(res, {
    districts,
  })
})

export const getLocationColleges = asyncHandler(async (req, res) => {
  const districtId = String(req.query.districtId || '').trim()
  const colleges = await listCollegesByDistrict({ districtId })

  return sendSuccess(res, {
    colleges,
  })
})
