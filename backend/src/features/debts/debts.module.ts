import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DebtOrmEntity } from './infrastructure/persistence/debt.orm-entity';
import { DebtRepositoryPgAdapter } from './infrastructure/persistence/debt-repository.pg.adapter';

import { DebtsController } from './presentation/debts.controller';

import { CreateDebtUseCase } from './application/use-cases/create-debt.usecase';
import { ListMyDebtsUseCase } from './application/use-cases/list-my-debts.usecase';
import { GetMyDebtUseCase } from './application/use-cases/get-my-debt.usecase';
import { UpdateDebtUseCase } from './application/use-cases/update-debt.usecase';
import { PayDebtUseCase } from './application/use-cases/pay-debt.usecase';
import { DeleteDebtUseCase } from './application/use-cases/delete-debt.usecase';

export const DEBTS_TOKENS = {
	DebtRepo: 'DEBTS/DebtRepo',
} as const;

@Module({
	imports: [TypeOrmModule.forFeature([DebtOrmEntity])],
	controllers: [DebtsController],
	providers: [
		// Infrastructure adapter binding
		{ provide: DEBTS_TOKENS.DebtRepo, useClass: DebtRepositoryPgAdapter },

		// UseCases puros (creados por factory, estilo tu guía)
		{ provide: CreateDebtUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new CreateDebtUseCase(repo) },
		{ provide: ListMyDebtsUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new ListMyDebtsUseCase(repo) },
		{ provide: GetMyDebtUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new GetMyDebtUseCase(repo) },
		{ provide: UpdateDebtUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new UpdateDebtUseCase(repo) },
		{ provide: PayDebtUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new PayDebtUseCase(repo) },
		{ provide: DeleteDebtUseCase, inject: [DEBTS_TOKENS.DebtRepo], useFactory: (repo) => new DeleteDebtUseCase(repo) },
	],
})
export class DebtsModule { }
