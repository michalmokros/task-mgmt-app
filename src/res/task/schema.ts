import Joi from 'joi'

import {
	customJoi,
	paginationSchema,
	tagName,
	tagNameCheck,
	tagNameRegex,
} from '../schema'

const taskDescription = Joi.string().min(1)
const taskProject = Joi.string().min(1).max(100)
const taskTags = Joi.array()
	.items(
		Joi.string().max(100).min(1).regex(tagNameRegex).messages(tagNameCheck),
	)
	.min(1)
	.max(100)
	.unique()

const taskSchema = {
	description: taskDescription.optional(),
	project: taskProject.optional(),
	tags: taskTags.optional(),
}

export const createTaskSchema = Joi.object({
	description: taskDescription.required(),
	project: taskProject.required(),
	tags: taskTags.optional(),
})

export const updateTaskSchema = Joi.object({
	...taskSchema,
	state: Joi.string().valid('done', 'in progress').optional(),
}).or('description', 'project', 'tags', 'state')

export const tasksSchema = Joi.object({
	...paginationSchema,
	...taskSchema,
	state: Joi.string().valid('done', 'in progress', 'new').optional(),
	tags: customJoi.stringArray().items(tagName).max(100).optional(),
})

export const taskTagsAddSchema = Joi.object({
	tags: taskTags.required(),
})

export const taskTagsRemoveSchema = Joi.object({
	tags: customJoi.stringArray().items(tagName).min(1).max(100).required(),
})
