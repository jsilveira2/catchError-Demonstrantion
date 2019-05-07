import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SessaoService } from '../sessao/sessao.service';
import { NotifyService } from '../../shared/components/notify/notify.service';
import { Notify } from '../../shared/components/notify/notify.model';
import { LoadService } from '../../shared/components/load/load.service';
import { Load } from '../../shared/components/load/load.model';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    navigateTo: string;
    display: boolean;
    emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    form: FormGroup = new FormGroup({
        'username': new FormControl(null, [Validators.required, Validators.pattern(this.emailPattern)]),
        'password': new FormControl(null, [Validators.required]),
    });

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private service: SessaoService,
        private notifyService: NotifyService,
        private loadService: LoadService
    ) { }

    ngOnInit() {
        if (this.activatedRoute.snapshot.params['to'] !== undefined) {
            this.navigateTo = this.activatedRoute.snapshot.params['to'] || btoa('/');
        }

        this.loadService.hideLoad();
    }

    convertTimeStamp(timeStamp: number) {
        const timeStamp2: number = timeStamp / 60;
        const hh: number = Math.floor(timeStamp2 / 60);
        const mm: number = Math.floor(timeStamp2 - (hh * 60));
        const ss: number = Math.floor(timeStamp % 60);
        return `${hh}:${mm}:${ss}`;
    }

    login(object) {
        this.loadService.showLoad(new Load());
        this.service.login(object.username, object.password).subscribe(
            sessao => {
                this.loadService.hideLoad();
                if (sessao.token !== undefined) {
                    this.router.navigate([atob(this.navigateTo)]);
                    this.notifyService.notify(new Notify({
                        summary: 'Bem vindo.',
                        detail: 'Seja bem vindo.'
                    }));
                }
            },
            er => {
                this.loadService.hideLoad();
                if (er.status === 401) {
                    if (er.error.message === 'Invalid credentials') {
                        const attempStatus = (JSON.parse(er.error.attempStatus));
                        switch (attempStatus.alert) {
                            case 'danger': {
                                this.notifyService.notify(new Notify({
                                    severity: 'error',
                                    summary: 'Tentativa de Login bloqueado pelo sistema.',
                                    detail: `Contate o administrador ou aguarde: ${this.convertTimeStamp(attempStatus.timeStamp)}.`
                                }));
                                break;
                            }
                            case 'warning': {
                                this.notifyService.notify(new Notify({
                                    severity: 'error',
                                    summary: 'Verifique seus dados.',
                                    detail: `Restam ${attempStatus.remainingAttemps} tentativas antes da conta ser bloqueada.`
                                }));
                                break;
                            }
                            case 'pattern': {
                                this.notifyService.notify(new Notify({
                                    severity: 'warn',
                                    summary: 'Dados inválidos.',
                                    detail: 'Usuário ou senha inválidos.'
                                }));
                                break;
                            }
                            default: {
                                this.notifyService.notify(new Notify({
                                    severity: 'warn',
                                    summary: 'Dados inválidos.',
                                    detail: 'Usuário ou senha inválidos.'
                                }));
                                break;
                            }
                        }
                    }
                }
            }
        );
    }
}
