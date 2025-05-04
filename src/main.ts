import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200', // Erlaube nur dieses Frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Erlaubte Methoden
    credentials: true, // Falls Cookies/Auth-Header gesendet werden
  });
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
}
bootstrap();