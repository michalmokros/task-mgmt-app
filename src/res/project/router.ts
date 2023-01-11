import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import { idSchema } from '../schema'
import { validator } from '../validator'

import {
	createProjectBodySchema,
	fetchProjectQuerySchema,
	fetchProjectsQuerySchema,
	updateProjectBodySchema,
} from './schema'
import * as service from './service'

import type { IPagination } from '../types'
import type { IProjectRequest } from './types'

export const router = Router()

router.post(
	'/',
	validator({ bodySchema: createProjectBodySchema }),
	async (req, res) => {
		const body = req.body as IProjectRequest

		const response = await service.create(body)

		res.send(response)
	},
)

router.patch(
	'/:id',
	validator({
		paramsSchema: idSchema,
		bodySchema: updateProjectBodySchema,
	}),
	async (req, res) => {
		const params = req.params as unknown as { id: number }
		const body = req.body as Partial<IProjectRequest>

		const response = await service.update(params.id, body)

		res.send(response)
	},
)

router.get(
	'/:id',
	validator({
		paramsSchema: idSchema,
		querySchema: fetchProjectQuerySchema,
	}),
	async (req, res) => {
		const params = req.params as unknown as { id: number }
		const query = req.query as { withTasks?: boolean }

		const response = await service.fetchOne(params.id, query.withTasks)

		res.send(response)
	},
)

router.get(
	'/',
	validator({ querySchema: fetchProjectsQuerySchema }),
	async (req, res) => {
		const query = req.query as Partial<IPagination & IProjectRequest>

		const response = await service.fetch(
			{
				name: query.name,
				description: query.description,
			},
			{
				limit: query.limit,
				offset: query.offset,
			},
		)

		res.send(response)
	},
)

router.delete(
	'/:id',
	validator({ paramsSchema: idSchema }),
	async (req, res) => {
		const params = req.params as unknown as { id: number }

		await service.remove(params.id)

		res.status(StatusCodes.NO_CONTENT).send()
	},
)
