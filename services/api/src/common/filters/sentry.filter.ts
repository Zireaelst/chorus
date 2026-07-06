import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import * as Sentry from '@sentry/node';

@Catch()
export class SentryExceptionFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // Only report 500s or unexpected errors to Sentry
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status >= 500) {
        this.captureToSentry(exception, host);
      }
    } else {
      this.captureToSentry(exception, host);
    }
    
    super.catch(exception, host);
  }

  private captureToSentry(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest();

    // Do NOT capture raw request payload per CODING_STANDARDS.md
    Sentry.withScope((scope) => {
      scope.setExtra('route', req.url);
      scope.setExtra('method', req.method);
      if (req.user) {
        scope.setUser({ id: req.user.id });
        if (req.user.orgId) {
          scope.setTag('orgId', req.user.orgId);
        }
      }
      Sentry.captureException(exception);
    });
  }
}
