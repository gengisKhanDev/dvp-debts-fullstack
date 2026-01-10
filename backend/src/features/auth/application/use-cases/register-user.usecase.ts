import { randomUUID } from 'crypto';
import { Email } from '../../domain/value-objects/email.vo';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/ports/user-repository.port';
import { RegisterUserCommand } from '../dto/register-user.command';
import { PasswordHasher } from './ports/password-hasher.port';

export class RegisterUserUseCase {
	constructor(
		private readonly users: UserRepository,
		private readonly hasher: PasswordHasher,
	) { }

	async execute(cmd: RegisterUserCommand): Promise<{ id: string; email: string }> {
		const email = Email.create(cmd.email);

		const exists = await this.users.findByEmail(email.value);
		if (exists) throw new Error('EmailAlreadyRegistered');

		const passwordHash = await this.hasher.hash(cmd.password);

		const user = new User(randomUUID(), email, passwordHash);
		const saved = await this.users.save(user);

		return { id: saved.id, email: saved.email.value };
	}
}
