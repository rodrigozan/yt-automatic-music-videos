import { Router } from 'express'
import * as routes from './routes'

const router = Router()

Object.values(routes).forEach(route => router.use(route))

export default router
