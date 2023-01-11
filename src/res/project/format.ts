import { formatTask } from '../task/format'

import type { Project } from '../../model'
import type { IProjectResponse } from './types'

export const formatProject = (project: Project): IProjectResponse => ({
	id: project.id,
	name: project.name,
	description: project.description,
	updatedAt: project.updatedAt.toISOString(),
	tasks: project.tasks?.map(formatTask),
})
