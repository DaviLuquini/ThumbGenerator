import { Routes } from '@angular/router';
import { Landing } from './modules/landing/pages/landing/landing';
import { Pricing } from './modules/landing/pages/pricing/pricing';

export const routes: Routes = [
    {
        path: '',
        component: Landing
    },
    {
        path: 'auth',
        loadChildren: () => import('./modules/auth/auth.routes').then(m => m.authRoutes)
    },
    {
        path: 'app',
        loadChildren: () => import('./modules/app/application.routes').then(m => m.applicationRoutes)
    },
    {
        path: 'pricing',
        component: Pricing
    },
    {
        path: '**',
        redirectTo: ''
    }
];
