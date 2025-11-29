// src/common/exceptions/base-business.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class BaseBusinessException extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super(message, status);
  }
}
