import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class UnauthorizedError extends BaseError {
	constructor(message: string) {
		super(StatusCodes.UNAUTHORIZED, message)
	}
}
