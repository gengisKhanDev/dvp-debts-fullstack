export const debtKeys = {
	list: (userId: string, status?: string) => `debts:list:${userId}:${status ?? 'ALL'}`,
	detail: (id: string) => `debts:detail:${id}`,
	listsToInvalidate: (userId: string) => [
		`debts:list:${userId}:ALL`,
		`debts:list:${userId}:PENDING`,
		`debts:list:${userId}:PAID`,
	],
};
