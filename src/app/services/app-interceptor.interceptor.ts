import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication/authentication.service';

@Injectable()
export class AppInterceptorInterceptor implements HttpInterceptor {

  constructor(private readonly authService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let reqClone: HttpRequest<unknown>;
    if (!request.url.endsWith('auth/login')) {
      const jwtToken = this.authService.getAccessToken();
      if (jwtToken) {
        reqClone = request.clone({ setHeaders: { authorization: jwtToken  }})
      }
    }
    return next.handle(reqClone || request);
  }
}
