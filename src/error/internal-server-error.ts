import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class InternalServerError extends BaseError {
	constructor(message: string) {
		console.error(message)

		super(StatusCodes.INTERNAL_SERVER_ERROR)
	}
}
