import { In } from 'typeorm'

import {
	projectRepository,
	tagRepository,
	taskRepository,
} from '../../config/data-source'
import { NotFoundError, ForbiddenError } from '../../error'
import { Task } from '../../model'

import { formatTask } from './format'
import { MAX_TAGS_ON_TASK } from './types'

import type { IPagination } from '../types'
import type {
	ITaskRequest,
	ITaskResponse,
	ITasksResponse,
	ITaskTags,
	ITaskUpdateRequest,
} from './types'

export const create = async (params: ITaskRequest): Promise<ITaskResponse> => {
	const project = await projectRepository.findOne({
		where: { name: params.project },
		select: ['id', 'name', 'description', 'updatedAt'],
	})

	if (!project) {
		throw new NotFoundError(
			`Project with name "${params.project}" does not exist.`,
		)
	}

	if (params.tags && params.tags.length > MAX_TAGS_ON_TASK) {
		throw new ForbiddenError(
			`Cannot create task due to maximum limit of 100 tags on task.`,
		)
	}

	let tags
	if (params.tags) {
		tags = params.tags.map((tagName) =>
			tagRepository.create({
				name: tagName,
			}),
		)

		await tagRepository.upsert(tags, {
			skipUpdateIfNoValuesChanged: true,
			conflictPaths: {
				name: true,
			},
		})

		tags = await tagRepository.find({
			where: {
				name: In(params.tags),
			},
		})
	}

	const task = taskRepository.create({
		description: params.description,
		project,
		tags,
	})

	await taskRepository.save(task)

	return formatTask(task)
}

export const update = async (
	id: number,
	params: Partial<ITaskUpdateRequest>,
): Promise<ITaskResponse> => {
	let task = await taskRepository.findOne({
		where: {
			id,
		},
		relations: ['project', 'tags'],
	})

	if (!task) {
		throw new NotFoundError(`Task with id "${id}" does not exist.`)
	}

	if (params.tags && params.tags.length > MAX_TAGS_ON_TASK) {
		throw new ForbiddenError(
			`Cannot update task "${id}" due to maximum limit of 100 tags on task.`,
		)
	}

	let project
	if (params.project) {
		project = await projectRepository.findOne({
			where: { name: params.project },
			select: ['id', 'name', 'description', 'updatedAt'],
		})

		if (!project) {
			throw new NotFoundError(
				`Project with name "${params.project}" does not exist.`,
			)
		}
	}

	let tags
	if (params.tags) {
		tags = params.tags.map((tagName) =>
			tagRepository.create({
				name: tagName,
			}),
		)

		await tagRepository.upsert(tags, {
			skipUpdateIfNoValuesChanged: true,
			conflictPaths: {
				name: true,
			},
		})

		tags = await tagRepository.find({
			where: {
				name: In(params.tags),
			},
		})
	}

	let doneAt
	if (task.state !== 'done' && params.state === 'done') {
		doneAt = new Date()
	} else if (task.state === 'done' && params.state !== 'done') {
		doneAt = null
	}

	await taskRepository.save({
		...task,
		description: params.description,
		project,
		tags,
		state: params.state,
		doneAt,
	})

	task = await taskRepository.findOneOrFail({
		where: {
			id,
		},
		relations: ['project', 'tags'],
		select: ['id', 'description', 'state', 'project', 'tags'],
	})

	return formatTask(task)
}

export const fetchOne = async (id: number): Promise<ITaskResponse> => {
	const task = await taskRepository.findOne({
		where: {
			id,
		},
		relations: ['project', 'tags'],
		select: ['id', 'description', 'state', 'project', 'tags'],
	})

	if (!task) {
		throw new NotFoundError(`Task with id "${id}" does not exist.`)
	}

	return formatTask(task)
}

export const fetch = async (
	params: Partial<ITaskRequest>,
	{ offset = 0, limit = 10 }: IPagination,
): Promise<ITasksResponse> => {
	const query = taskRepository
		.createQueryBuilder('task')
		.skip(offset)
		.take(limit)

	if (params.description) {
		query.where('task.description like :description', {
			description: params.description && `%${params.description}%`,
		})
	}

	if (params.project) {
		query
			.leftJoinAndSelect('task.project', 'project')
			.where('project.name = :projectName', {
				projectName: params.project,
			})
	}

	if (params.tags) {
		query
			.leftJoinAndSelect('task.tags', 'tag')
			.where('tag.name in (:...tagNames)', { tagNames: params.tags })
			.groupBy('task.id')
			.having('count(*) = :tagCount', { tagCount: params.tags.length })
	}

	const taskIds = await query.select(['task.id']).getMany()

	const tasks = await taskRepository.find({
		where: {
			id: In(taskIds.map((task) => task.id)),
		},
		relations: ['project', 'tags'],
		select: ['id', 'description', 'state', 'project', 'tags'],
	})

	return {
		total: tasks.length,
		tasks: tasks.map(formatTask),
	}
}

export const remove = async (id: number): Promise<void> => {
	const doesTaskExist = await taskRepository.exist({
		where: {
			id,
		},
	})

	if (!doesTaskExist) {
		throw new NotFoundError(`Task with id "${id}" does not exist.`)
	}

	await taskRepository.softDelete(id)
}

export const manageTags = async (
	id: number,
	params: ITaskTags,
	operation: 'add' | 'remove',
): Promise<ITaskResponse> => {
	const task = await taskRepository.findOne({
		where: {
			id,
		},
		relations: ['tags'],
		select: ['id', 'tags'],
	})

	if (!task) {
		throw new NotFoundError(`Task with id "${id}" does not exist.`)
	}

	let tagsToUse: string[]
	if (operation === 'add') {
		tagsToUse = params.tags.filter(
			(tagName) => !task?.tags.map((tag) => tag.name).includes(tagName),
		)

		if (tagsToUse.length + task.tags.length > MAX_TAGS_ON_TASK) {
			throw new ForbiddenError(
				`Cannot add new tags to task "${id}" due to maximum limit of 100 tags on task.`,
			)
		}

		await tagRepository.upsert(
			tagsToUse.map((tagName) =>
				tagRepository.create({
					name: tagName,
				}),
			),
			{
				skipUpdateIfNoValuesChanged: true,
				conflictPaths: {
					name: true,
				},
			},
		)
	} else {
		tagsToUse = params.tags.filter((tagName) =>
			task?.tags.map((tag) => tag.name).includes(tagName),
		)
	}

	const tags = await tagRepository.find({
		where: {
			name: In(tagsToUse),
		},
	})

	const query = taskRepository
		.createQueryBuilder('task')
		.relation(Task, 'tags')
		.of(task)

	if (operation === 'add') {
		await query.add(tags)
	} else if (operation === 'remove') {
		await query.remove(tags)
	}

	const taskToReturn = await taskRepository.findOneOrFail({
		where: {
			id,
		},
		relations: ['project', 'tags'],
		select: ['id', 'description', 'state', 'project', 'tags'],
	})

	return formatTask(taskToReturn)
}
