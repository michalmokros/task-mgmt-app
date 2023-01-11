import Joi from 'joi'

import { customJoi, paginationSchema, tagName } from '../schema'

export const fetchTagSchema = Joi.object({
	...paginationSchema,
	name: tagName.optional(),
})

export const tagsSchema = Joi.object({
	names: customJoi.stringArray().items(tagName).min(1).max(100).required(),
})
