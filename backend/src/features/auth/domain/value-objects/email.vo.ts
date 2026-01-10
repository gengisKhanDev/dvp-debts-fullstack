export class Email {
	private constructor(public readonly value: string) { }

	static create(raw: string): Email {
		const v = (raw ?? '').trim().toLowerCase();
		// Regla simple para la prueba (puedes endurecer luego)
		if (!v || !v.includes('@')) {
			throw new Error('InvalidEmail');
		}
		return new Email(v);
	}
}
