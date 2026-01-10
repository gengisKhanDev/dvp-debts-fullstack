import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	Req,
	UseGuards,
	ForbiddenException,
} from '@nestjs/common';
import type { Request } from 'express';

import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';
import { CreateDebtUseCase } from '../application/use-cases/create-debt.usecase';
import { ListMyDebtsUseCase } from '../application/use-cases/list-my-debts.usecase';
import { GetMyDebtUseCase } from '../application/use-cases/get-my-debt.usecase';
import { UpdateDebtUseCase } from '../application/use-cases/update-debt.usecase';
import { PayDebtUseCase } from '../application/use-cases/pay-debt.usecase';
import { DeleteDebtUseCase } from '../application/use-cases/delete-debt.usecase';
import { CreateDebtRequest } from './dto/create-debt.request';
import { UpdateDebtRequest } from './dto/update-debt.request';

type AuthenticatedRequest = Request & { user: { userId: string; email: string } };

@UseGuards(JwtAuthGuard)
@Controller('debts')
export class DebtsController {
	constructor(
		private readonly createUC: CreateDebtUseCase,
		private readonly listUC: ListMyDebtsUseCase,
		private readonly getUC: GetMyDebtUseCase,
		private readonly updateUC: UpdateDebtUseCase,
		private readonly payUC: PayDebtUseCase,
		private readonly deleteUC: DeleteDebtUseCase,
	) { }

	@Post()
	async create(@Req() req: AuthenticatedRequest, @Body() body: CreateDebtRequest) {
		try {
			return await this.createUC.execute({
				debtorUserId: req.user.userId,
				creditorName: body.creditorName,
				creditorEmail: body.creditorEmail ?? null,
				creditorPhone: body.creditorPhone ?? null,
				amount: body.amount,
				description: body.description ?? null,
			});
		} catch (e: any) {
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Get()
	async list(@Req() req: AuthenticatedRequest, @Query('status') status?: 'PENDING' | 'PAID') {
		return this.listUC.execute({ debtorUserId: req.user.userId, status });
	}

	@Get(':id')
	async get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.getUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException();
			if (e?.message === 'Forbidden') throw new ForbiddenException();
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Patch(':id')
	async update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: UpdateDebtRequest) {
		try {
			return await this.updateUC.execute({
				debtorUserId: req.user.userId,
				debtId: id,
				...body,
			});
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException();
			if (e?.message === 'Forbidden') throw new ForbiddenException();
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Post(':id/pay')
	async pay(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.payUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException();
			if (e?.message === 'Forbidden') throw new ForbiddenException();
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Delete(':id')
	async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.deleteUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException();
			if (e?.message === 'Forbidden') throw new ForbiddenException();
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}
}
