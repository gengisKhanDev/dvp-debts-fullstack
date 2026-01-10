import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateDebtRequest {
	@IsOptional()
	@IsString()
	creditorName?: string;

	@IsOptional()
	@IsEmail()
	creditorEmail?: string | null;

	@IsOptional()
	@IsString()
	creditorPhone?: string | null;

	@IsOptional()
	@IsNumber()
	@Min(0)
	amount?: number;

	@IsOptional()
	@IsString()
	description?: string | null;
}
