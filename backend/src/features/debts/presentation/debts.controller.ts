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
	StreamableFile,
	Res,
} from '@nestjs/common';
import type { Request, Response as ExpressResponse } from 'express';
import {
	ApiTags,
	ApiBearerAuth,
	ApiOperation,
	ApiCreatedResponse,
	ApiOkResponse,
	ApiBadRequestResponse,
	ApiUnauthorizedResponse,
	ApiForbiddenResponse,
	ApiNotFoundResponse,
	ApiParam,
	ApiQuery,
	ApiProduces,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/presentation/guards/jwt-auth.guard';

import { CreateDebtUseCase } from '../application/use-cases/create-debt.usecase';
import { ListMyDebtsUseCase } from '../application/use-cases/list-my-debts.usecase';
import { GetMyDebtUseCase } from '../application/use-cases/get-my-debt.usecase';
import { UpdateDebtUseCase } from '../application/use-cases/update-debt.usecase';
import { PayDebtUseCase } from '../application/use-cases/pay-debt.usecase';
import { DeleteDebtUseCase } from '../application/use-cases/delete-debt.usecase';
import { GetDebtsSummaryUseCase } from '../application/use-cases/get-debts-summary.usecase';

import { CreateDebtRequest } from './dto/create-debt.request';
import { UpdateDebtRequest } from './dto/update-debt.request';
import { ExportDebtsQuery } from './dto/export-debts.query';

import { OkResponse } from '../../../common/presentation/swagger/ok.response';
import { ApiErrorResponse } from '../../../common/presentation/swagger/api-error.response';

import {
	CreateDebtResponse,
	DebtResponse,
	DebtSummaryResponse,
} from './dto/debt.responses';

import { toCsv } from '../../../common/presentation/csv/csv.util';

type AuthenticatedRequest = Request & { user: { userId: string; email: string } };

@UseGuards(JwtAuthGuard)
@Controller('debts')
@ApiTags('debts')
@ApiBearerAuth()
export class DebtsController {
	constructor(
		private readonly createUC: CreateDebtUseCase,
		private readonly listUC: ListMyDebtsUseCase,
		private readonly getUC: GetMyDebtUseCase,
		private readonly updateUC: UpdateDebtUseCase,
		private readonly payUC: PayDebtUseCase,
		private readonly deleteUC: DeleteDebtUseCase,
		private readonly summaryUC: GetDebtsSummaryUseCase,
	) { }

	// ✅ static routes BEFORE :id
	@Get('export')
	@ApiOperation({ summary: 'Exporta tus deudas en JSON o CSV' })
	@ApiProduces('application/json', 'text/csv')
	@ApiOkResponse({ description: 'Archivo JSON/CSV (download)' })
	async exportMyDebts(
		@Req() req: AuthenticatedRequest,
		@Query() q: ExportDebtsQuery,
		@Res({ passthrough: true }) res: ExpressResponse,
	): Promise<StreamableFile> {
		const format = q.format ?? 'json';
		const status = q.status;

		const debts = await this.listUC.execute({ debtorUserId: req.user.userId, status });

		const date = new Date().toISOString().slice(0, 10);
		const statusPart = (status ?? 'ALL').toLowerCase();
		const filename = `debts-${statusPart}-${date}.${format}`;

		if (format === 'csv') {
			const rows = debts.map((d: any) => ({
				id: d.id,
				creditorName: d.creditorName,
				creditorEmail: d.creditorEmail ?? '',
				creditorPhone: d.creditorPhone ?? '',
				amount: d.amount,
				description: d.description ?? '',
				status: d.status,
				createdAt: d.createdAt,
				updatedAt: d.updatedAt,
				paidAt: d.paidAt ?? '',
			}));

			const csv = toCsv(rows, [
				'id',
				'creditorName',
				'creditorEmail',
				'creditorPhone',
				'amount',
				'description',
				'status',
				'createdAt',
				'updatedAt',
				'paidAt',
			]);

			res.set({
				'Content-Type': 'text/csv; charset=utf-8',
				'Content-Disposition': `attachment; filename="${filename}"`,
			});
			return new StreamableFile(Buffer.from(csv, 'utf8'));
		}

		res.set({
			'Content-Type': 'application/json; charset=utf-8',
			'Content-Disposition': `attachment; filename="${filename}"`,
		});
		return new StreamableFile(Buffer.from(JSON.stringify(debts, null, 2), 'utf8'));
	}

	@Get('summary')
	@ApiOperation({ summary: 'Agregados de mis deudas (totales y saldo pendiente)' })
	@ApiOkResponse({ type: DebtSummaryResponse })
	async summary(@Req() req: AuthenticatedRequest) {
		return this.summaryUC.execute(req.user.userId);
	}

	@Post()
	@ApiOperation({ summary: 'Create a new debt (PENDING)' })
	@ApiCreatedResponse({ type: CreateDebtResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	@ApiUnauthorizedResponse({ type: ApiErrorResponse })
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
	@ApiOperation({ summary: 'List debts of current user' })
	@ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'PAID'] })
	@ApiOkResponse({ type: DebtResponse, isArray: true })
	@ApiUnauthorizedResponse({ type: ApiErrorResponse })
	async list(@Req() req: AuthenticatedRequest, @Query('status') status?: 'PENDING' | 'PAID') {
		return this.listUC.execute({ debtorUserId: req.user.userId, status });
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a debt by id (must belong to current user)' })
	@ApiParam({ name: 'id', example: '5e6a745b-530e-4236-8427-9351dba405bf' })
	@ApiOkResponse({ type: DebtResponse })
	@ApiNotFoundResponse({ type: ApiErrorResponse })
	@ApiForbiddenResponse({ type: ApiErrorResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	async get(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.getUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException('DebtNotFound');
			if (e?.message === 'Forbidden') throw new ForbiddenException('Forbidden');
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Update a PENDING debt (PAID cannot be modified)' })
	@ApiParam({ name: 'id', example: '5e6a745b-530e-4236-8427-9351dba405bf' })
	@ApiOkResponse({ type: OkResponse })
	@ApiNotFoundResponse({ type: ApiErrorResponse })
	@ApiForbiddenResponse({ type: ApiErrorResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	async update(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() body: UpdateDebtRequest) {
		try {
			return await this.updateUC.execute({
				debtorUserId: req.user.userId,
				debtId: id,
				...body,
			});
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException('DebtNotFound');
			if (e?.message === 'Forbidden') throw new ForbiddenException('Forbidden');
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Post(':id/pay')
	@ApiOperation({ summary: 'Mark debt as PAID' })
	@ApiParam({ name: 'id', example: '5e6a745b-530e-4236-8427-9351dba405bf' })
	@ApiOkResponse({ type: OkResponse })
	@ApiNotFoundResponse({ type: ApiErrorResponse })
	@ApiForbiddenResponse({ type: ApiErrorResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	async pay(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.payUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException('DebtNotFound');
			if (e?.message === 'Forbidden') throw new ForbiddenException('Forbidden');
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Delete a PENDING debt (PAID cannot be deleted)' })
	@ApiParam({ name: 'id', example: '5e6a745b-530e-4236-8427-9351dba405bf' })
	@ApiOkResponse({ type: OkResponse })
	@ApiNotFoundResponse({ type: ApiErrorResponse })
	@ApiForbiddenResponse({ type: ApiErrorResponse })
	@ApiBadRequestResponse({ type: ApiErrorResponse })
	async remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
		try {
			return await this.deleteUC.execute(req.user.userId, id);
		} catch (e: any) {
			if (e?.message === 'DebtNotFound') throw new NotFoundException('DebtNotFound');
			if (e?.message === 'Forbidden') throw new ForbiddenException('Forbidden');
			throw new BadRequestException(e?.message ?? 'BadRequest');
		}
	}
}
