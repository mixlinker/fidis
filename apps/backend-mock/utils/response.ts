import type { EventHandlerRequest, H3Event } from 'h3';

export function useResponseSuccess<T = any>(result: T) {
  return {
    code: 200,
    msg: 'ok',
    result,
  };
}

export function useResponseError(message: string, error: any = null) {
  return {
    code: -1,
    data: null,
    error,
    message,
  };
}

export function forbiddenResponse(event: H3Event<EventHandlerRequest>) {
  setResponseStatus(event, 403);
  return useResponseError('ForbiddenException', 'Forbidden Exception');
}

export function unAuthorizedResponse(event: H3Event<EventHandlerRequest>) {
  setResponseStatus(event, 401);
  return useResponseError('UnauthorizedException', 'Unauthorized Exception');
}
