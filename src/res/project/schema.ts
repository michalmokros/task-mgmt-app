import Joi from 'joi'

import { paginationSchema } from '../schema'

const projectName = Joi.string().max(100)

const projectBodySchema = {
	name: projectName.optional(),
	description: Joi.string().optional().allow(null),
}

export const createProjectBodySchema = Joi.object({
	...projectBodySchema,
	name: projectName.required(),
})

export const updateProjectBodySchema = Joi.object({
	...projectBodySchema,
}).or('name', 'description')

export const fetchProjectsQuerySchema = Joi.object({
	...paginationSchema,
	...projectBodySchema,
})

export const fetchProjectQuerySchema = Joi.object({
	withTasks: Joi.boolean().optional(),
}).optional()
