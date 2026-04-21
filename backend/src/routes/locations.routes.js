import { Router } from 'express'

import {
  getLocationColleges,
  getLocationDistricts,
  getLocationStates,
} from '../controllers/locations.controller.js'

const router = Router()

router.get('/locations/states', getLocationStates)
router.get('/locations/districts', getLocationDistricts)
router.get('/locations/colleges', getLocationColleges)

export default router
