export const debtKeys = {
	list: (userId: string, status?: 'PENDING' | 'PAID') =>
		`debts:list:${userId}:${status ?? 'ALL'}`,

	detail: (userId: string, debtId: string) =>
		`debts:detail:${userId}:${debtId}`,

	summary: (userId: string) => `debts:summary:${userId}`,

	listsToInvalidate: (userId: string) => [
		`debts:list:${userId}:ALL`,
		`debts:list:${userId}:PENDING`,
		`debts:list:${userId}:PAID`,
	],

	readsToInvalidateOnWrite: (userId: string) => [
		...debtKeys.listsToInvalidate(userId),
		debtKeys.summary(userId),
	],

	invalidateOnWrite: (userId: string, debtId?: string) => [
		...debtKeys.readsToInvalidateOnWrite(userId),
		...(debtId ? [debtKeys.detail(userId, debtId)] : []),
	],
};
