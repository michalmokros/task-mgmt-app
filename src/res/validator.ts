import { ValidationError } from 'joi'

import {
	BadRequestError,
	InternalServerError,
	UnprocessableEntityError,
} from '../error'

import type { Request, Response, NextFunction } from 'express'
import type { Schema } from 'joi'

export const validator = ({
	bodySchema,
	paramsSchema,
	querySchema,
}: {
	paramsSchema?: Schema
	querySchema?: Schema
	bodySchema?: Schema
}) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		await Promise.all([
			validate('params', req, paramsSchema),
			validate('query', req, querySchema),
			validate('body', req, bodySchema),
		])

		next()
	}
}

const validate = async (
	requestType: 'body' | 'params' | 'query',
	req: Request,
	schema?: Schema,
): Promise<void> => {
	if (schema) {
		if (!req[requestType]) {
			throw new BadRequestError(`"${requestType}" is missing`)
		}

		try {
			await schema.validateAsync(req[requestType])
		} catch (err) {
			if (err instanceof ValidationError) {
				throw new UnprocessableEntityError(
					`${requestType}: ${err.message}`,
				)
			}

			throw new InternalServerError((err as Error).message)
		}
	}
}
