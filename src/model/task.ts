import {
	Column,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	UpdateDateColumn,
} from 'typeorm'

import { Model } from './model'
import { Project } from './project'
import { Tag } from './tag'

@Entity({ engine: 'InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci' })
export class Task extends Model {
	@Column({
		type: 'text',
	})
	description!: string

	@Column({
		type: 'enum',
		enum: ['done', 'in progress', 'new'],
		default: 'new',
	})
	state!: 'done' | 'in progress' | 'new'

	@Column({
		type: 'timestamp',
		nullable: true,
	})
	doneAt!: Date | null

	@UpdateDateColumn()
	updatedAt!: Date

	@DeleteDateColumn()
	deletedAt!: Date | null

	@ManyToOne(() => Project, (project) => project.tasks)
	project!: Project

	@ManyToMany(() => Tag, (tag) => tag.tasks)
	@JoinTable({
		name: 'tasks_tags',
	})
	tags!: Tag[]
}
