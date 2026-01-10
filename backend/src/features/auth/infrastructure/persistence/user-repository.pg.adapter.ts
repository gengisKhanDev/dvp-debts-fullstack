import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserRepository } from '../../domain/ports/user-repository.port';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class UserRepositoryPgAdapter implements UserRepository {
	constructor(
		@InjectRepository(UserOrmEntity)
		private readonly repo: Repository<UserOrmEntity>,
	) { }

	async findByEmail(email: string): Promise<User | null> {
		const row = await this.repo.findOne({ where: { email } });
		return row ? new User(row.id, Email.create(row.email), row.passwordHash) : null;
	}

	async findById(id: string): Promise<User | null> {
		const row = await this.repo.findOne({ where: { id } });
		return row ? new User(row.id, Email.create(row.email), row.passwordHash) : null;
	}

	async save(user: User): Promise<User> {
		const row = this.repo.create({
			id: user.id,
			email: user.email.value,
			passwordHash: user.passwordHash,
		});
		await this.repo.save(row);
		return user;
	}
}
