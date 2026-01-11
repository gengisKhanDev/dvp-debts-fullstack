export class RegisterResponse {
	/**
	 * User id (uuid).
	 * @example "6659d8b1-b157-4911-b017-f75eab788ed0"
	 */
	id!: string;

	/**
	 * User email.
	 * @example "a@a.com"
	 */
	email!: string;
}

export class LoginResponse {
	/**
	 * JWT access token.
	 * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
	 */
	accessToken!: string;
}

export class MeResponse {
	/**
	 * Authenticated user id.
	 * @example "6659d8b1-b157-4911-b017-f75eab788ed0"
	 */
	userId!: string;

	/**
	 * Authenticated user email.
	 * @example "a@a.com"
	 */
	email!: string;
}
