import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';

import { URL_API } from '../../app.api';
import { Sessao } from './sessao.model';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
const basePath = `${URL_API}/admi-usuario`;

@Injectable()
export class SessaoService {

    public sessao: Sessao;
    lastUrl: string;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.router.events.filter(e => e instanceof NavigationEnd)
            .subscribe((e: NavigationEnd) => this.lastUrl = e.url);
    }

    login(email: string, password: string): Observable<Sessao> {
        const header = new HttpHeaders();
        header.append('Content-Type', 'application/json');

        return this.http.post<Sessao>(
            `${basePath}/login`, { username: email, password: password, conta: '1' }, { headers: header }
        );
    }

    logout() {
        localStorage.clear();
        this.sessao = undefined;
        this.router.navigate(['/login']);
    }

    isLoogedIn(): boolean {
        const token = localStorage.getItem('token');
        return token !== null;
    }

    handleLogin(path: string = this.lastUrl) {
        localStorage.clear();
        this.sessao = undefined;
        this.router.navigate(['/login', btoa(path)]);
    }


    tokenVerify(token: any): Observable<any> {
        return this.http.get<any>(`${basePath}/tokenverify/${token}`);
    }
}
