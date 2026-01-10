import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { HealthModule } from './features/health/health.module';
import { AuthModule } from './features/auth/auth.module';
import { DebtsModule } from './features/debts/debts.module';

@Module({
	imports: [
		// CONFIG (framework allowed)
		// - Lee .env y expone ConfigService (ideal para no hardcodear secrets/DB)
		ConfigModule.forRoot({ isGlobal: true }),

		// DB (infrastructure wiring)
		// - forRootAsync permite inyectar ConfigService (limpio y testeable)
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (cfg: ConfigService) => ({
				type: 'postgres',
				host: cfg.get<string>('DB_HOST'),
				port: Number(cfg.get<string>('DB_PORT')),
				username: cfg.get<string>('DB_USER'),
				password: cfg.get<string>('DB_PASSWORD'),
				database: cfg.get<string>('DB_NAME'),
				autoLoadEntities: true,
				synchronize: true, // ✅ ok para prueba técnica / ❌ no recomendado en prod
			}),
		}),
		DebtsModule,
		HealthModule,
		AuthModule,
	],
})
export class AppModule { }