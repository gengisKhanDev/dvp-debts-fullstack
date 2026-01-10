export class Money {
	private constructor(public readonly cents: number) { }

	static fromAmount(amount: number): Money {
		if (!Number.isFinite(amount)) throw new Error('InvalidAmount');
		if (amount < 0) throw new Error('InvalidAmount');
		const cents = Math.round(amount * 100);
		return new Money(cents);
	}

	static fromCents(cents: number): Money {
		if (!Number.isInteger(cents) || cents < 0) throw new Error('InvalidAmount');
		return new Money(cents);
	}

	toAmount(): number {
		return this.cents / 100;
	}
}
