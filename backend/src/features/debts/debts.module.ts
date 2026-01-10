import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

import { DebtsController } from './presentation/debts.controller';

import { DebtOrmEntity } from './infrastructure/persistence/debt.orm-entity';
import { DebtRepositoryPgAdapter } from './infrastructure/persistence/debt-repository.pg.adapter';

import type { CachePort } from './application/ports/cache.port';
import { RedisCacheAdapter } from './infrastructure/cache/redis-cache.adapter';

import { CreateDebtUseCase } from './application/use-cases/create-debt.usecase';
import { ListMyDebtsUseCase } from './application/use-cases/list-my-debts.usecase';
import { GetMyDebtUseCase } from './application/use-cases/get-my-debt.usecase';
import { UpdateDebtUseCase } from './application/use-cases/update-debt.usecase';
import { PayDebtUseCase } from './application/use-cases/pay-debt.usecase';
import { DeleteDebtUseCase } from './application/use-cases/delete-debt.usecase';

export const DEBTS_TOKENS = {
	DebtRepo: 'DEBTS/DebtRepo',
	RedisClient: 'DEBTS/RedisClient',
	Cache: 'DEBTS/Cache',
} as const;

function getRedisUrl(cfg: ConfigService): string {
	const host = cfg.getOrThrow<string>('REDIS_HOST');
	const port = Number(cfg.getOrThrow<string>('REDIS_PORT'));
	return `redis://${host}:${port}`;
}

function getCacheTtlSeconds(cfg: ConfigService): number {
	const raw = cfg.get<string>('CACHE_TTL_SECONDS') ?? '30';
	const ttl = Number(raw);
	return Number.isFinite(ttl) && ttl > 0 ? ttl : 30;
}

@Module({
	imports: [TypeOrmModule.forFeature([DebtOrmEntity])],
	controllers: [DebtsController],
	providers: [
		// --- Port -> Adapter (DB) ---
		{ provide: DEBTS_TOKENS.DebtRepo, useClass: DebtRepositoryPgAdapter },

		// --- Redis client (async provider) ---
		{
			provide: DEBTS_TOKENS.RedisClient,
			inject: [ConfigService],
			useFactory: async (cfg: ConfigService) => {
				const client = createClient({ url: getRedisUrl(cfg) });

				// recomendado por Redis docs
				client.on('error', (err) => console.error('Redis Client Error', err)); // :contentReference[oaicite:2]{index=2}

				await client.connect(); // :contentReference[oaicite:3]{index=3}
				return client;
			},
		},

		// --- CachePort -> Redis adapter ---
		{
			provide: DEBTS_TOKENS.Cache,
			inject: [DEBTS_TOKENS.RedisClient],
			useFactory: (client): CachePort => new RedisCacheAdapter(client),
		},

		// --- UseCases (Clean: se crean por factory) ---
		{
			provide: CreateDebtUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache],
			useFactory: (repo, cache: CachePort) => new CreateDebtUseCase(repo, cache),
		},
		{
			provide: ListMyDebtsUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache, ConfigService],
			useFactory: (repo, cache: CachePort, cfg: ConfigService) =>
				new ListMyDebtsUseCase(repo, cache, getCacheTtlSeconds(cfg)),
		},
		{
			provide: GetMyDebtUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache, ConfigService],
			useFactory: (repo, cache: CachePort, cfg: ConfigService) =>
				new GetMyDebtUseCase(repo, cache, getCacheTtlSeconds(cfg)),
		},
		{
			provide: UpdateDebtUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache],
			useFactory: (repo, cache: CachePort) => new UpdateDebtUseCase(repo, cache),
		},
		{
			provide: PayDebtUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache],
			useFactory: (repo, cache: CachePort) => new PayDebtUseCase(repo, cache),
		},
		{
			provide: DeleteDebtUseCase,
			inject: [DEBTS_TOKENS.DebtRepo, DEBTS_TOKENS.Cache],
			useFactory: (repo, cache: CachePort) => new DeleteDebtUseCase(repo, cache),
		},
	],
})
export class DebtsModule { }
