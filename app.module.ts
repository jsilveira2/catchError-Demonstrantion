import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
registerLocaleData(ptBr);
import 'rxjs/add/operator/toPromise';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routes';
import { ApplicationErrorHandler } from './app.error-handler';
import { HotkeyModule, HotkeysService } from 'angular2-hotkeys';
import { DateLocale } from './shared/components/datalocale.component';

import { ApplicationModule } from './application/application.module';
import { PactControlModule } from './pact-control/pact-control.module';
import { PrimeNgModule } from './primeng/primeng.module';
import { SharedModule } from './shared/shared.module';
import { IndicatorsModule } from './core/indicators/indicators.module';

import { LoginComponent } from './core/login/login.component';
import { SessaoService } from './core/sessao/sessao.service';
import { LoggedInGuard } from './core/loggedin.guard';
import { AuthIncerceptor } from './core/auth.incerceptor';
import { EsquecisenhaComponent } from './core/forgot-password/forgot-password.component';
import { RecoverPasswordComponent } from './core/recover-password/recover-password.component';
import { MenuComponent, SubMenuComponent } from './core/menu/menu.component';
import { FooterComponent } from './core/footer/footer.component';
import { UserMenuComponent } from './core/user-menu/user-menu.component';

import { NotifyService } from './shared/components/notify/notify.service';
import { NotifyComponent } from './shared/components/notify/notify.component';
import { LoadService } from './shared/components/load/load.service';
import { LoadComponent } from './shared/components/load/load.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutes,
        HttpModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PrimeNgModule.forRoot(),
        HotkeyModule.forRoot(),
        SharedModule.forRoot(),
        PactControlModule,
        ApplicationModule,
        IndicatorsModule
    ],
    declarations: [
        AppComponent,
        MenuComponent,
        SubMenuComponent,
        FooterComponent,
        UserMenuComponent,
        LoginComponent,
        EsquecisenhaComponent,
        RecoverPasswordComponent,
        NotifyComponent,
        LoadComponent
    ],
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: LOCALE_ID, useValue: 'pt-BR' },
        { provide: HTTP_INTERCEPTORS, useClass: AuthIncerceptor, multi: true },
        SessaoService, LoggedInGuard, NotifyService, LoadService, HotkeysService, DateLocale, ApplicationErrorHandler
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
