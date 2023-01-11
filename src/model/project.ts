import {
	Column,
	DeleteDateColumn,
	Entity,
	OneToMany,
	UpdateDateColumn,
} from 'typeorm'

import { Model } from './model'
import { Task } from './task'

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Project extends Model {
	@Column({
		length: 100,
		unique: true,
	})
	name!: string

	@Column({
		type: 'text',
		nullable: true,
	})
	description!: string | null

	@UpdateDateColumn()
	updatedAt!: Date

	@DeleteDateColumn()
	deletedAt!: Date | null

	@OneToMany(() => Task, (task) => task.project, { cascade: true })
	tasks!: Task[]
}
