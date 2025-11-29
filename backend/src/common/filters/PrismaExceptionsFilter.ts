// src/common/filters/prisma-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Request, Response } from 'express';
import { sendErrorResponse } from '../utils/errorResponseUtil';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.BAD_REQUEST;
    let message = 'Erro na operação de banco de dados.';

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      const fields = (exception.meta?.target as string[]) || [];
      message = `Já existe um registro com este valor no campo: ${fields.join(', ')}`;
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'O registro solicitado não foi encontrado no banco de dados.';
    } else {
      this.logger.error(
        `Prisma Error: ${exception.code} - ${exception.message}`,
      );
    }

    sendErrorResponse(response, status, message, request.url);
  }
}
