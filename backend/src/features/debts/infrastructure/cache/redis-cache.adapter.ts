import { Injectable } from '@nestjs/common';
import type { CachePort } from '../../application/ports/cache.port';

type MinimalRedisClient = {
	get(key: string): Promise<string | null>;
	set(key: string, value: string, opts: { EX: number }): Promise<unknown>;
	del(...keys: string[]): Promise<unknown>;
};

@Injectable()
export class RedisCacheAdapter implements CachePort {
	constructor(private readonly client: MinimalRedisClient) { }

	async get<T>(key: string): Promise<T | null> {
		const raw = await this.client.get(key);
		return raw ? (JSON.parse(raw) as T) : null;
	}

	async set<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
		await this.client.set(key, JSON.stringify(value), { EX: ttlSeconds });
	}

	async del(keys: string[]): Promise<void> {
		if (!keys.length) return;
		await this.client.del(...keys);
	}
}
