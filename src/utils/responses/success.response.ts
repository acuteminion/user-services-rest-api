import { HttpStatusCode } from 'axios';
import { Response } from '../interfaces/response.interface';

export function successResponse(
  message: string | string[],
  data: any,
): Response {
  return {
    statusCode: HttpStatusCode.Ok,
    message: message,
    data: data,
  };
}
