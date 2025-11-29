import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './common/filters/BusinessExceptionsFilter';
import { GlobalExceptionFilter } from './common/filters/GlobalExceptionsFilter';
import { PrismaExceptionFilter } from './common/filters/PrismaExceptionsFilter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaExceptionFilter(),
    new BusinessExceptionFilter(),
  );

  await app.listen(3000);
}
void bootstrap();
