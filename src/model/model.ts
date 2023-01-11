import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export abstract class Model {
	@PrimaryGeneratedColumn()
	id!: number

	@CreateDateColumn()
	createdAt!: Date
}
