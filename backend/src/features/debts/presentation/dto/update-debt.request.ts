import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDebtRequest {
	/**
	 * Creditor name (optional).
	 * @example "Juan (editado)"
	 */
	@IsOptional()
	@IsString()
	creditorName?: string;

	/**
	 * Creditor email (optional).
	 * @example "juan2@test.com"
	 */
	@IsOptional()
	@IsEmail()
	creditorEmail?: string;

	/**
	 * Creditor phone (optional).
	 * @example "300999999"
	 */
	@IsOptional()
	@IsString()
	creditorPhone?: string;

	/**
	 * Amount (optional, >= 0).
	 * @example 99.9
	 */
	@IsOptional()
	@IsNumber()
	@Min(0)
	amount?: number;

	/**
	 * Description (optional).
	 * @example "cambio"
	 */
	@IsOptional()
	@IsString()
	description?: string;
}
