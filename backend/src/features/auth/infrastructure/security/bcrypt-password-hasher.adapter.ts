import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import { PasswordHasher } from '../../application/use-cases/ports/password-hasher.port';

@Injectable()
export class BcryptPasswordHasherAdapter implements PasswordHasher {
	private readonly cost: number;

	constructor(cfg: ConfigService) {
		this.cost = Number(cfg.get('BCRYPT_COST') ?? 10);
	}

	hash(plain: string): Promise<string> {
		return bcrypt.hash(plain, this.cost);
	}

	compare(plain: string, hash: string): Promise<boolean> {
		return bcrypt.compare(plain, hash);
	}
}
