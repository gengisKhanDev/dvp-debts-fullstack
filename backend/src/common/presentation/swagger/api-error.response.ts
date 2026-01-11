export class ApiErrorResponse {
	/**
	 * HTTP status code.
	 * @example 400
	 */
	statusCode!: number;

	/**
	 * HTTP error label.
	 * @example "Bad Request"
	 */
	error!: string;

	/**
	 * Domain/Use-case error code.
	 * @example "PaidDebtCannotBeModified"
	 */
	message!: string;
}