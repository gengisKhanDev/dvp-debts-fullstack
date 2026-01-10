import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateDebtRequest {
	@IsString()
	creditorName!: string;

	@IsOptional()
	@IsEmail()
	creditorEmail?: string;

	@IsOptional()
	@IsString()
	creditorPhone?: string;

	@IsNumber()
	@Min(0)
	amount!: number;

	@IsOptional()
	@IsString()
	description?: string;
}
