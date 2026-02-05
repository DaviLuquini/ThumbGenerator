import { Routes } from '@angular/router';
import { LoginPage } from './pages/login/login';
import { RegisterPage } from './pages/register/register';

export const authRoutes: Routes = [
    {
        path: 'login',
        component: LoginPage
    },
    {
        path: 'register',
        component: RegisterPage
    },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
