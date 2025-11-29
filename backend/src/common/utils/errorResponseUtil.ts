// src/common/utils/error-response.util.ts
import { Response } from 'express';

export const sendErrorResponse = (
  res: Response,
  status: number,
  message: string | string[],
  path: string,
) => {
  res.status(status).json({
    success: false,
    message,
    timestamp: new Date().toISOString(),
    path,
  });
};
