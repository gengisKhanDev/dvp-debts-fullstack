import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { RegisterUserUseCase } from '../application/use-cases/register-user.usecase';
import { LoginUseCase } from '../application/use-cases/login.usecase';
import { RegisterRequest } from './dto/register.request';
import { LoginRequest } from './dto/login.request';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
	ApiTags,
	ApiOperation,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiBearerAuth,
} from '@nestjs/swagger';
import { ApiErrorResponse } from '../../../common/presentation/swagger/api-error.response';
import { RegisterResponse, LoginResponse, MeResponse } from './dto/auth.responses';

type AuthenticatedRequest = Request & {
	user: { userId: string; email: string };
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly registerUC: RegisterUserUseCase,
		private readonly loginUC: LoginUseCase,
	) { }

	@Post('register')
	@ApiOperation({ summary: 'Register a new user' })
	@ApiCreatedResponse({ type: RegisterResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	register(@Body() body: RegisterRequest) {
		return this.registerUC.execute({ email: body.email, password: body.password });
	}

	@Post('login')
	@ApiOperation({ summary: 'Login and obtain JWT access token' })
	@ApiOkResponse({ type: LoginResponse })
	@ApiUnauthorizedResponse({ type: ApiErrorResponse })
	login(@Body() body: LoginRequest) {
		return this.loginUC.execute({ email: body.email, password: body.password });
	}

	@UseGuards(JwtAuthGuard)
	@Get('me')
	@ApiBearerAuth('access-token')
	@ApiOperation({ summary: 'Get current authenticated user' })
	@ApiOkResponse({ type: MeResponse })
	@ApiUnauthorizedResponse({ type: ApiErrorResponse })
	me(@Req() req: AuthenticatedRequest) {
		return req.user;
	}
}
