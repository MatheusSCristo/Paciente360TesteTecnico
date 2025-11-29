import { HttpStatus } from '@nestjs/common';
import { BaseBusinessException } from '../../common/exceptions/BaseBusinessException';

export class InvalidDateException extends BaseBusinessException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
