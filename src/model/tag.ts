import { Check, Column, Entity, ManyToMany } from 'typeorm'

import { tagNameRegex } from '../res/schema'

import { Model } from './model'
import { Task } from './task'

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Tag extends Model {
	@Column({
		length: 100,
		unique: true,
	})
	@Check(`"name" ~ '${tagNameRegex.source}'`)
	name!: string

	@ManyToMany(() => Task, (task) => task.tags)
	tasks!: Task[]
}
