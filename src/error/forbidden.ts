import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class ForbiddenError extends BaseError {
	constructor(message: string) {
		super(StatusCodes.FORBIDDEN, message)
	}
}
