import type { StatusCodes } from 'http-status-codes'

export abstract class BaseError extends Error {
	public statusCode: StatusCodes

	constructor(statusCode: StatusCodes, message?: string) {
		super(message)

		this.statusCode = statusCode
	}
}
