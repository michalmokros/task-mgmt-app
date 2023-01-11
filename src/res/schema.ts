import Joi from 'joi'

export const tagNameRegex = /^[0-9a-zA-Z]+(?: [0-9a-zA-Z]+)*$/

export const tagNameCheck = {
	'string.pattern.base':
		'{{#label}} with value {:[.]} must contain only alphanum and space, and start and end with alphanum character',
}

export const paginationSchema = {
	limit: Joi.number().optional().max(20).min(1),
	offset: Joi.number().optional().min(0),
}

export const idSchema = Joi.object({
	id: Joi.number().required().min(1),
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const customJoi: { stringArray(): Joi.ArraySchema<unknown[]> } =
	Joi.extend((joi) => ({
		base: joi.array(),
		coerce: (value) => ({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
			value: value.split ? value.split(',') : value,
		}),
		type: 'stringArray',
	}))

export const tagName = Joi.string()
	.max(100)
	.min(1)
	.regex(tagNameRegex)
	.messages(tagNameCheck)
