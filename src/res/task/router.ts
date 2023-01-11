import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import { idSchema } from '../schema'
import { validator } from '../validator'

import {
	createTaskSchema,
	tasksSchema,
	taskTagsAddSchema,
	taskTagsRemoveSchema,
	updateTaskSchema,
} from './schema'
import * as service from './service'

import type { IPagination } from '../types'
import type { ITaskRequest, ITaskTags, ITaskUpdateRequest } from './types'

export const router = Router()

router.post(
	'/',
	validator({ bodySchema: createTaskSchema }),
	async (req, res) => {
		const body = req.body as ITaskRequest

		const response = await service.create({
			description: body.description,
			project: body.project,
			tags: body.tags,
		})

		res.send(response)
	},
)

router.patch(
	'/:id',
	validator({ paramsSchema: idSchema, bodySchema: updateTaskSchema }),
	async (req, res) => {
		const params = req.params as unknown as { id: number }
		const body = req.body as Partial<ITaskUpdateRequest>

		const response = await service.update(params.id, {
			description: body.description,
			project: body.project,
			tags: body.tags,
			state: body.state,
		})

		res.send(response)
	},
)

router.get('/:id', validator({ paramsSchema: idSchema }), async (req, res) => {
	const params = req.params as unknown as { id: number }

	const response = await service.fetchOne(params.id)

	res.send(response)
})

router.get('/', validator({ querySchema: tasksSchema }), async (req, res) => {
	const query = req.query as Partial<IPagination & ITaskRequest>
	query.tags &&= (query.tags as unknown as string).split(',')

	const response = await service.fetch(
		{
			description: query.description,
			project: query.project,
			tags: query.tags,
		},
		{
			limit: query.limit,
			offset: query.offset,
		},
	)

	res.send(response)
})

router.delete(
	'/:id',
	validator({ paramsSchema: idSchema }),
	async (req, res) => {
		const params = req.params as unknown as { id: number }

		await service.remove(params.id)

		res.status(StatusCodes.NO_CONTENT).send()
	},
)

router.patch(
	'/:id/tags',
	validator({ paramsSchema: idSchema, bodySchema: taskTagsAddSchema }),
	async (req, res) => {
		const params = req.params as unknown as { id: number }
		const body = req.body as unknown as ITaskTags

		const response = await service.manageTags(params.id, body, 'add')

		res.send(response)
	},
)

router.delete(
	'/:id/tags',
	validator({ paramsSchema: idSchema, querySchema: taskTagsRemoveSchema }),
	async (req, res) => {
		const params = req.params as unknown as { id: number }
		const query = req.query as unknown as ITaskTags
		query.tags &&= (query.tags as unknown as string).split(',')

		const response = await service.manageTags(params.id, query, 'remove')

		res.send(response)
	},
)
