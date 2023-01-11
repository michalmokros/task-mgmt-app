import type { IProjectResponse } from '../project/types'

export interface ITaskTags {
	tags: string[]
}

export interface ITaskRequest extends Partial<ITaskTags> {
	description: string
	project: string
}

export interface ITaskUpdateRequest extends ITaskRequest {
	state: 'done' | 'in progress'
}

export interface ITaskResponse extends ITaskTags {
	id: number
	description: string
	state: 'done' | 'in progress' | 'new'
	project: IProjectResponse
}

export interface ITasksResponse {
	total: number
	tasks: ITaskResponse[]
}

export const MAX_TAGS_ON_TASK = 100
