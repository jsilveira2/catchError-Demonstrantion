import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { LoginComponent } from './core/login/login.component';
import { LoggedInGuard } from './core/loggedin.guard';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login/:to', component: LoginComponent },
    { path: 'login', component: LoginComponent },
];

export const AppRoutes: ModuleWithProviders = RouterModule.forRoot(routes);
