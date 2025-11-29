export interface ApiPaginationMeta {
  page: number;
  total: number;
  perPage?: number;
  totalPages?: number;
}

export class ApiResponse<T> {
  message: string;
  data?: T;
  timestamp: string;
  meta?: Record<string, any>;

  private constructor(message: string, data?: T, meta?: Record<string, any>) {
    this.message = message;
    this.data = data;
    this.meta = meta;
    this.timestamp = new Date().toISOString();
  }

  static success<T>({
    data,
    message = 'Operação realizada com sucesso',
  }: {
    data?: T;
    message?: string;
  }): ApiResponse<T> {
    return new ApiResponse<T>(message, data);
  }

  static successPaginated<T>({
    data,
    meta,
    message = 'Lista recuperada',
  }: {
    data: T;
    meta: ApiPaginationMeta;
    message?: string;
  }): ApiResponse<T> {
    return new ApiResponse(message, data, meta);
  }
}
