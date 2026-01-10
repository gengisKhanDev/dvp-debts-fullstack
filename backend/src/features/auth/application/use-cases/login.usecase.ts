import { UserRepository } from '../../domain/ports/user-repository.port';
import { LoginCommand } from '../dto/login.command';
import { LoginResult } from '../dto/login.result';
import { PasswordHasher } from './ports/password-hasher.port';
import { TokenService } from './ports/token-service.port';

export class LoginUseCase {
	constructor(
		private readonly users: UserRepository,
		private readonly hasher: PasswordHasher,
		private readonly tokens: TokenService,
	) { }

	async execute(cmd: LoginCommand): Promise<LoginResult> {
		const user = await this.users.findByEmail(cmd.email.toLowerCase().trim());
		if (!user) throw new Error('InvalidCredentials');

		const ok = await this.hasher.compare(cmd.password, user.passwordHash);
		if (!ok) throw new Error('InvalidCredentials');

		const accessToken = await this.tokens.signAccessToken({
			sub: user.id,
			email: user.email.value,
		});

		return { accessToken };
	}
}
