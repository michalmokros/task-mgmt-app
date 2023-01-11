import { Router } from 'express'
import { StatusCodes } from 'http-status-codes'

import { validator } from '../validator'

import { fetchTagSchema, tagsSchema } from './schema'
import * as service from './service'

import type { IPagination } from '../types'
import type { ITag, ITags } from './types'

export const router = Router()

router.post('/', validator({ bodySchema: tagsSchema }), async (req, res) => {
	const body = req.body as ITags

	const response = await service.create(body)

	res.send(response)
})

router.get(
	'/',
	validator({ querySchema: fetchTagSchema }),
	async (req, res) => {
		const query = req.query as unknown as IPagination & ITag

		const response = await service.fetch(
			{
				name: query.name,
			},
			{
				limit: query.limit,
				offset: query.offset,
			},
		)

		res.send(response)
	},
)

router.delete('/', validator({ querySchema: tagsSchema }), async (req, res) => {
	const query = req.query as unknown as ITags
	query.names &&= (query.names as unknown as string).split(',')

	await service.remove(query)

	res.status(StatusCodes.NO_CONTENT).send()
})
