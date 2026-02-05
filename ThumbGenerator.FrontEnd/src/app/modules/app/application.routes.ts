import { Routes } from "@angular/router";
import { Dashboard } from "./pages/dashboard/dashboard";
import { ThumbnailComposer } from "./pages/thumbnail-composer/thumbnail-composer";
import { authGuard } from "../../core/guards/auth.guard";

export const applicationRoutes: Routes = [
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'thumbnail-composer',
        component: ThumbnailComposer,
        canActivate: [authGuard]
    },
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    }
];
