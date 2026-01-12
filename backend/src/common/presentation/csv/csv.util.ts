export function toCsv<T extends Record<string, any>>(rows: T[], columns: (keyof T)[]): string {
	const escape = (v: unknown) => {
		if (v === null || v === undefined) return '';
		const s = String(v);
		// Si tiene comas, saltos o comillas => se envuelve en comillas y se escapan comillas dobles
		if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
		return s;
	};

	const header = columns.join(',');
	const lines = rows.map((r) => columns.map((c) => escape(r[c])).join(','));
	return [header, ...lines].join('\n') + '\n';
}
