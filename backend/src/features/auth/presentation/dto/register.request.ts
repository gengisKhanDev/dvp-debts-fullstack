import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterRequest {
	/**
	 * User email.
	 * @example "a@a.com"
	 */
	@IsEmail()
	email!: string;

	/**
	 * User password (min 6 chars).
	 * @example "123456"
	 */
	@IsString()
	@MinLength(6)
	password!: string;
}
