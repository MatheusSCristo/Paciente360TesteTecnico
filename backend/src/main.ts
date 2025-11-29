import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BusinessExceptionFilter } from './common/filters/BusinessExceptionsFilter';
import { GlobalExceptionFilter } from './common/filters/GlobalExceptionsFilter';
import { PrismaExceptionFilter } from './common/filters/PrismaExceptionsFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(
    new GlobalExceptionFilter(),
    new PrismaExceptionFilter(),
    new BusinessExceptionFilter(),
  );

  await app.listen(3000);
}
void bootstrap();
