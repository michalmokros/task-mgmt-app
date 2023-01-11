import { DataSource } from 'typeorm'

import { Project, Tag, Task } from '../model'

export const appDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: parseInt(process.env.DB_PORT ?? '5432', 10),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [Project, Tag, Task],
})

export const projectRepository = appDataSource.getRepository(Project)
export const taskRepository = appDataSource.getRepository(Task)
export const tagRepository = appDataSource.getRepository(Tag)
