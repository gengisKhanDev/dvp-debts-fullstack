import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Debt, DebtStatus } from '../../domain/entities/debt.entity';
import { DebtRepository } from '../../domain/ports/debt-repository.port';
import { Money } from '../../domain/value-objects/money.vo';
import { DebtOrmEntity } from './debt.orm-entity';

@Injectable()
export class DebtRepositoryPgAdapter implements DebtRepository {
	constructor(
		@InjectRepository(DebtOrmEntity)
		private readonly repo: Repository<DebtOrmEntity>,
	) { }

	async findById(id: string): Promise<Debt | null> {
		const row = await this.repo.findOne({ where: { id } });
		return row ? this.toDomain(row) : null;
	}

	async listByDebtor(debtorUserId: string, status?: DebtStatus): Promise<Debt[]> {
		const rows = await this.repo.find({
			where: status ? { debtorUserId, status } : { debtorUserId },
			order: { createdAt: 'DESC' },
		});
		return rows.map((r) => this.toDomain(r));
	}

	async save(debt: Debt): Promise<Debt> {
		const row = this.repo.create({
			id: debt.id,
			debtorUserId: debt.debtorUserId,
			creditorName: debt.creditorName,
			creditorEmail: debt.creditorEmail,
			creditorPhone: debt.creditorPhone,
			amountCents: debt.amount.cents,
			description: debt.description,
			status: debt.status,
			createdAt: debt.createdAt,
			updatedAt: debt.updatedAt,
			paidAt: debt.paidAt,
		});
		await this.repo.save(row);
		return debt;
	}

	async deleteById(id: string): Promise<void> {
		await this.repo.delete({ id });
	}

	private toDomain(row: DebtOrmEntity): Debt {
		return new Debt(
			row.id,
			row.debtorUserId,
			row.creditorName,
			row.creditorEmail,
			row.creditorPhone,
			Money.fromCents(row.amountCents),
			row.description,
			row.status,
			row.createdAt,
			row.updatedAt,
			row.paidAt,
		);
	}
}
