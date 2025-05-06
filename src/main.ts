import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000, '0.0.0.0'); // Bindet an alle Interfaces für Docker
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();