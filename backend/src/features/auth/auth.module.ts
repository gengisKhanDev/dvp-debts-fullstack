import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { AuthController } from './presentation/auth.controller';
import { JwtStrategy } from './presentation/strategies/jwt.strategy';

import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { UserRepositoryPgAdapter } from './infrastructure/persistence/user-repository.pg.adapter';
import { BcryptPasswordHasherAdapter } from './infrastructure/security/bcrypt-password-hasher.adapter';
import { JwtTokenServiceAdapter } from './infrastructure/security/jwt-token-service.adapter';

import { RegisterUserUseCase } from './application/use-cases/register-user.usecase';
import { LoginUseCase } from './application/use-cases/login.usecase';

export const AUTH_TOKENS = {
	UserRepo: 'AUTH/UserRepo',
	PasswordHasher: 'AUTH/PasswordHasher',
	TokenService: 'AUTH/TokenService',
} as const;

function getExpiresIn(cfg: ConfigService): number | import('ms').StringValue {
	const raw = (cfg.get<string>('JWT_EXPIRES_IN') ?? '1h').trim();

	// si viene como "3600" -> segundos
	if (/^\d+$/.test(raw)) return Number(raw);

	// si viene como "1h", "30m", "15s", etc
	if (/^\d+(ms|s|m|h|d|w|y)$/i.test(raw)) {
		return raw as import('ms').StringValue;
	}

	// fallback seguro
	return '1h';
}

@Module({
	imports: [
		TypeOrmModule.forFeature([UserOrmEntity]),
		JwtModule.registerAsync({
			inject: [ConfigService],
			useFactory: (cfg: ConfigService) => ({
				secret: cfg.getOrThrow<string>('JWT_SECRET'),
				signOptions: { expiresIn: getExpiresIn(cfg) },
			}),
		}),
	],
	controllers: [AuthController],
	providers: [
		JwtStrategy,

		// Infrastructure bindings (adapters)
		{ provide: AUTH_TOKENS.UserRepo, useClass: UserRepositoryPgAdapter },
		{ provide: AUTH_TOKENS.PasswordHasher, useClass: BcryptPasswordHasherAdapter },
		{ provide: AUTH_TOKENS.TokenService, useClass: JwtTokenServiceAdapter },

		// Application use-cases (puros) creados vía factory (tu estilo “config”)
		{
			provide: RegisterUserUseCase,
			inject: [AUTH_TOKENS.UserRepo, AUTH_TOKENS.PasswordHasher],
			useFactory: (users, hasher) => new RegisterUserUseCase(users, hasher),
		},
		{
			provide: LoginUseCase,
			inject: [AUTH_TOKENS.UserRepo, AUTH_TOKENS.PasswordHasher, AUTH_TOKENS.TokenService],
			useFactory: (users, hasher, tokens) => new LoginUseCase(users, hasher, tokens),
		},
	],
})
export class AuthModule { }
