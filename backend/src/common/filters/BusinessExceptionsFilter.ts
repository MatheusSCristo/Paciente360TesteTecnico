// src/common/filters/business-exception.filter.ts
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseBusinessException } from '../exceptions/BaseBusinessException';
import { sendErrorResponse } from '../utils/errorResponseUtil';

@Catch(BaseBusinessException)
export class BusinessExceptionFilter implements ExceptionFilter {
  catch(exception: BaseBusinessException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    sendErrorResponse(
      response,
      exception.getStatus(),
      exception.message,
      request.url,
    );
  }
}
