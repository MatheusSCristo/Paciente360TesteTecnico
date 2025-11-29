import { HttpStatus } from '@nestjs/common';
import { BaseBusinessException } from '../../common/exceptions/BaseBusinessException';

export class TaskNotFoundException extends BaseBusinessException {
  constructor() {
    super('Tarefa não encontrada', HttpStatus.NOT_FOUND);
  }
}
