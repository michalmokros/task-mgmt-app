import * as os from 'os'

import express, { json } from 'express'
import { StatusCodes } from 'http-status-codes'
import { verify as jwtVerify } from 'jsonwebtoken'

import { BaseError, UnauthorizedError } from '../error'
import { createRoutes } from '../res/routes'

import type { NextFunction, Request, Response } from 'express'

export const create = (port = process.env.PORT ?? 3000): void => {
	const routes = createRoutes()
	const app = express()

	app.use(json())
	app.use(authHandler)
	app.use(routes)
	app.use(errorHandler)

	const hostname = os.hostname()
	app.listen(port, () => {
		console.log(
			`Process ${hostname}:${process.pid} listening on port: ${port}`,
		)
	})
}

const errorHandler = <T extends Error>(
	error: T,
	req: Request,
	res: Response,
	// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
	next: NextFunction,
): void => {
	if (error instanceof BaseError) {
		res.status(error.statusCode).send(
			error.message && {
				message: error.message,
			},
		)
	} else {
		console.log('Error during the application run.')
		console.error({
			name: error.name,
			stack: error.stack,
			message: error.message,
		})

		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send()
	}
	next()
}

const authHandler = (req: Request, res: Response, next: NextFunction): void => {
	const bearerHeader = req.headers.authorization

	if (bearerHeader) {
		const bearers = bearerHeader.split(' ')

		if (bearers.length < 2) {
			throw new UnauthorizedError('Missing authorization token.')
		}

		jwtVerify(bearers[1], process.env.SECRET_KEY as string, (err) => {
			if (err) {
				throw new UnauthorizedError('Authorization has failed.')
			} else {
				next()
			}
		})
	} else {
		throw new UnauthorizedError('Missing authorization header.')
	}
}
