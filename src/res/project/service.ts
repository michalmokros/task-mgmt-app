import { Like } from 'typeorm'

import { projectRepository } from '../../config/data-source'
import { ForbiddenError, NotFoundError } from '../../error'

import { formatProject } from './format'

import type { IPagination } from '../types'
import type {
	IProjectRequest,
	IProjectResponse,
	IProjectsResponse,
} from './types'

export const create = async ({
	name,
	description,
}: IProjectRequest): Promise<IProjectResponse> => {
	const doesProjectExist = await projectRepository.exist({
		where: {
			name,
		},
	})

	if (doesProjectExist) {
		throw new ForbiddenError(`Project with name "${name}" already exists.`)
	}

	const project = projectRepository.create({
		name,
		description,
	})

	await projectRepository.insert(project)

	return formatProject(project)
}

export const update = async (
	id: number,
	params: Partial<IProjectRequest>,
): Promise<IProjectResponse> => {
	let doesProjectExist = await projectRepository.exist({
		where: {
			id,
		},
	})

	if (!doesProjectExist) {
		throw new NotFoundError(`Project with id "${id}" does not exist.`)
	}

	if (params.name) {
		doesProjectExist = await projectRepository.exist({
			where: {
				name: params.name,
			},
		})

		if (doesProjectExist) {
			throw new ForbiddenError(
				`Project with name "${params.name}" already exists.`,
			)
		}
	}

	await projectRepository.update(id, params)
	const project = await projectRepository.findOneOrFail({
		where: {
			id,
		},
		select: ['id', 'name', 'description', 'updatedAt'],
	})

	return formatProject(project)
}

export const fetchOne = async (
	id: number,
	withTasks = false,
): Promise<IProjectResponse> => {
	const query = projectRepository
		.createQueryBuilder('project')
		.where('project.id = :projectId', { projectId: id })

	if (withTasks) {
		query
			.leftJoinAndSelect('project.tasks', 'task')
			.leftJoinAndSelect('task.tags', 'tag')
			.select([
				'project.id',
				'project.name',
				'project.description',
				'project.updatedAt',
				'task.id',
				'task.description',
				'task.state',
				'tag.name',
			])
	} else {
		query.select([
			'project.id',
			'project.name',
			'project.description',
			'project.updatedAt',
		])
	}

	const project = await query.getOne()

	if (!project) {
		throw new NotFoundError(`Project with id "${id}" does not exist.`)
	}

	return formatProject(project)
}

export const fetch = async (
	params: Partial<IProjectRequest>,
	{ limit = 10, offset = 0 }: IPagination,
): Promise<IProjectsResponse> => {
	const [projects, total] = await projectRepository.findAndCount({
		take: limit,
		skip: offset,
		where: {
			name: params.name && Like(`%${params.name}%`),
			description: params.description && Like(`%${params.description}%`),
		},
		select: ['id', 'name', 'description', 'updatedAt'],
	})

	return {
		total,
		projects: projects.map(formatProject),
	}
}

export const remove = async (id: number): Promise<void> => {
	const project = await projectRepository.findOne({
		where: {
			id,
		},
		relations: ['tasks'],
	})

	if (!project) {
		throw new NotFoundError(`Project with id "${id}" does not exist.`)
	}

	await projectRepository.softRemove(project)
}
