import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SessaoService } from './sessao/sessao.service';
import { Observable, throwError, of } from 'rxjs/';
import { _throw } from 'rxjs/observable/throw';
import { catchError, tap, map } from 'rxjs/operators';
import { ApplicationErrorHandler } from '../app.error-handler';
import 'rxjs/add/observable/throw';

@Injectable()
export class AuthIncerceptor implements HttpInterceptor {

    constructor(private injector: Injector, public errorHandler: ApplicationErrorHandler) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const sessaoService = this.injector.get(SessaoService);
        if (sessaoService.isLoogedIn()) {
            const token = localStorage.getItem('token');
            const tokenSplit = token.split(' ');
            request = request.clone(
                { setHeaders: { 'Authorization': `${tokenSplit[1]}` } }
            );
        }

        return next.handle(request).pipe(
            catchError(err => {
                let data = {};
                data = {
                    error: err,
                    status: err.status,
                    method: request.method
                };

                this.errorHandler.handleError(data);
                return of(err);
            })
        );
    }
}
