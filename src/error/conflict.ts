import { StatusCodes } from 'http-status-codes'

import { BaseError } from './base'

export class ConflictError extends BaseError {
	constructor(message: string) {
		super(StatusCodes.CONFLICT, message)
	}
}
