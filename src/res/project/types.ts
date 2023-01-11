import type { ITaskResponse } from '../task/types'

export interface IProjectRequest {
	name: string
	description?: string
}

export interface IProjectResponse {
	id: number
	name: string
	description: string | null
	updatedAt: string
	tasks?: ITaskResponse[]
}

export interface IProjectsResponse {
	total: number
	projects: IProjectResponse[]
}
