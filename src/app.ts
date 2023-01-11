import 'reflect-metadata'
import * as dotenv from 'dotenv'

dotenv.config()

import * as api from './config/api'
import { appDataSource } from './config/data-source'

const run = async (): Promise<void> => {
	try {
		await appDataSource.initialize()
	} catch (err) {
		console.log('Error while connection to the database')
		console.error(err)
		process.exit(0)
	}

	try {
		api.create()
	} catch (err) {
		console.log('Error during server initialization')
		console.error(err)
		process.exit(0)
	}
}

void run()
