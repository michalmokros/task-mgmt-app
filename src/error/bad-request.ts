import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class BadRequestError extends BaseError {
	constructor(message: string) {
		super(StatusCodes.BAD_REQUEST, message)
	}
}
