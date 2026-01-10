import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(cfg: ConfigService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'), // ✅ ya no es undefined
		});
	}

	validate(payload: { sub: string; email: string }) {
		return { userId: payload.sub, email: payload.email };
	}
}
