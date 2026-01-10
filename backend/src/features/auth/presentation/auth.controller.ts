import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';

import { RegisterUserUseCase } from '../application/use-cases/register-user.usecase';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RegisterRequest } from './dto/register.request';
import { LoginRequest } from './dto/login.request';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

type AuthenticatedRequest = Request & {
	user: { userId: string; email: string };
};

@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUC: RegisterUserUseCase,
		private readonly loginUC: LoginUseCase,
	) { }

	@Post('register')
	register(@Body() body: RegisterRequest) {
		// Controller = presentation: solo traduce request -> command
		return this.registerUC.execute({ email: body.email, password: body.password });
	}

	@Post('login')
	login(@Body() body: LoginRequest) {
		return this.loginUC.execute({ email: body.email, password: body.password });
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	me(@Req() req: AuthenticatedRequest) {
		return req.user;
	}
}