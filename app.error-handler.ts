import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SessaoService } from './core/sessao/sessao.service';
import { NotifyService } from './shared/components/notify/notify.service';
import { Notify } from './shared/components/notify/notify.model';

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {

    userId = localStorage.getItem('iduser');

    constructor(private injector: Injector, private sessaoService: SessaoService, public notifyService: NotifyService) {
        super();
    }

    handleError(errorResponse: HttpErrorResponse | any) {
        // Pega todo response que houve erro
        if (errorResponse.error instanceof HttpErrorResponse) {
            if (errorResponse.error !== undefined) {
                if (errorResponse.error.code === 40101) {
                    this.notifyService.notify(new Notify({
                        type: 'alert',
                        summary: 'Sessão Expirada.',
                        detail: 'Sua sessão foi expirada, por favor, faça o login novamente.'
                    }));

                    this.sessaoService.handleLogin();
                } else if (errorResponse.status === 401) {
                    if (errorResponse.method !== 'GET') {
                        if (this.userId !== null && this.userId !== '') {
                            this.notifyService.notify(new Notify({
                                severity: 'warn',
                                summary: 'Sem permissão.',
                                detail: 'Você não possui permissão para executar essa ação.'
                            }));
                        }
                    }
                }
            } else {
                this.notifyService.notify(new Notify({
                    type: 'alert',
                    summary: 'Houve uma falha no sistema, entre em contato com o suporte.',
                    detail: errorResponse.error.error.message
                }));
            }
        }

        super.handleError(errorResponse.error);
    }
}
