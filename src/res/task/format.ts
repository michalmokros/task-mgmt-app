import { formatProject } from '../project/format'
import { formatTag } from '../tag/format'

import type { Task } from '../../model'
import type { ITaskResponse } from './types'

export const formatTask = (task: Task): ITaskResponse => ({
	id: task.id,
	description: task.description,
	state: task.state,
	project: task.project && formatProject(task.project),
	tags: task.tags?.map(formatTag) ?? [],
})
