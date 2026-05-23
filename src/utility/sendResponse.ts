import type { Response } from "express";
import { error } from "node:console";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    error: data.error,
  });
};

export default sendResponse;
