import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { TokenService } from '../../application/use-cases/ports/token-service.port';

@Injectable()
export class JwtTokenServiceAdapter implements TokenService {
	constructor(private readonly jwt: JwtService) { }

	async signAccessToken(payload: { sub: string; email: string }): Promise<string> {
		return this.jwt.signAsync(payload);
	}
}