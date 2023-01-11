import { Router } from 'express'

import { router as projectRouter } from './project/router'
import { router as tagRouter } from './tag/router'
import { router as taskRouter } from './task/router'

export const createRoutes = (): Router => {
	const router = Router()

	router.use('/projects', projectRouter)
	router.use('/tags', tagRouter)
	router.use('/tasks', taskRouter)

	return router
}
