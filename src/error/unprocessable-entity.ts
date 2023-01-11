import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class UnprocessableEntityError extends BaseError {
	constructor(message: string) {
		super(StatusCodes.UNPROCESSABLE_ENTITY, message)
	}
}
