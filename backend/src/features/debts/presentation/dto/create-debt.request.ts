import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDebtRequest {
	/**
	 * Creditor name.
	 * @example "Juan"
	 */
	@IsString()
	creditorName!: string;

	/**
	 * Creditor email (optional).
	 * @example "juan@test.com"
	 */
	@IsOptional()
	@IsEmail()
	creditorEmail?: string;

	/**
	 * Creditor phone (optional).
	 * @example "300123123"
	 */
	@IsOptional()
	@IsString()
	creditorPhone?: string;

	/**
	 * Debt amount (>= 0).
	 * @example 12.5
	 */
	@IsNumber()
	@Min(0)
	amount!: number;

	/**
	 * Optional description.
	 * @example "pizza"
	 */
	@IsOptional()
	@IsString()
	description?: string;
}
