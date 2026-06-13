import { HttpStatus, ArgumentsHost } from '@nestjs/common';

export class ErrorsService {
  public static notFound(request) {

    return {
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Not found',
      path: request.path,
      method: request.method,
    };
  }
}
