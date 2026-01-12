import { IsIn, IsOptional } from 'class-validator';

export class ExportDebtsQuery {
	/** Formato de exportación: "json" | "csv". Por defecto "json". */
	@IsOptional()
	@IsIn(['json', 'csv'])
	format?: 'json' | 'csv';

	/** Filtro opcional por estado: "PENDING" | "PAID". */
	@IsOptional()
	@IsIn(['PENDING', 'PAID'])
	status?: 'PENDING' | 'PAID';
}
