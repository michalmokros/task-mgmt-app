import { In, Like } from 'typeorm'

import { tagRepository } from '../../config/data-source'
import { ConflictError } from '../../error'

import { formatTag } from './format'

import type { IPagination } from '../types'
import type { ITag, ITags, ITagsResponse } from './types'

export const create = async ({ names }: ITags): Promise<ITagsResponse> => {
	const tags = names.map((name) =>
		tagRepository.create({
			name,
		}),
	)

	await tagRepository.upsert(tags, {
		skipUpdateIfNoValuesChanged: true,
		conflictPaths: {
			name: true,
		},
	})

	return {
		total: tags.length,
		tags: tags.map(formatTag),
	}
}

export const fetch = async (
	params: ITag,
	{ limit = 20, offset = 0 }: IPagination,
): Promise<ITagsResponse> => {
	const [tags, total] = await tagRepository.findAndCount({
		take: limit,
		skip: offset,
		where: {
			name: params.name && Like(`%${params.name}%`),
		},
		order: {
			createdAt: 'desc',
		},
		select: ['name'],
	})

	return {
		total,
		tags: tags.map(formatTag),
	}
}

export const remove = async ({ names }: ITags): Promise<void> => {
	const tags = await tagRepository.find({
		where: {
			name: In(names),
		},
		relations: ['tasks'],
	})

	if (tags.find((tag) => tag.tasks.length)) {
		throw new ConflictError(
			`Cannot delete tags: "${names.join(
				', ',
			)}" because related tasks exist`,
		)
	}

	await tagRepository.delete({ name: In(names) })
}
