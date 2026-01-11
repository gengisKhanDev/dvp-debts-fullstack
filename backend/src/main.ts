import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const config = new DocumentBuilder()
		.setTitle('Debts API')
		.setDescription('API para autenticación y gestión de deudas (Clean Architecture + Feature-based).')
		.setVersion('1.0.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				in: 'header',
			},
			'access-token',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('docs', app, document, {
		customSiteTitle: 'Debts API Docs',
		swaggerOptions: {
			persistAuthorization: true,
			displayRequestDuration: true,
			docExpansion: 'none',
			filter: true,
		},
	});

	await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
