import { Email } from '../value-objects/email.vo';

export class User {
	constructor(
		public readonly id: string,
		public readonly email: Email,
		public readonly passwordHash: string,
	) { }
}
