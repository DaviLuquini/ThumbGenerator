import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
    id: string;
    email: string;
    name: string;
    credits: number;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);

    private _user = signal<User | null>(null);
    private _isLoading = signal(false);

    user = this._user.asReadonly();
    isLoading = this._isLoading.asReadonly();
    isAuthenticated = computed(() => !!this._user());
    credits = computed(() => this._user()?.credits ?? 0);

    constructor() {
        this.loadUserFromToken();
    }

    register(data: RegisterRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, data).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(err => {
                this._isLoading.set(false);
                return throwError(() => err);
            })
        );
    }

    login(data: LoginRequest): Observable<AuthResponse> {
        this._isLoading.set(true);
        return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, data).pipe(
            tap(response => this.handleAuthSuccess(response)),
            catchError(err => {
                this._isLoading.set(false);
                return throwError(() => err);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('auth_token');
        this._user.set(null);
        this.router.navigate(['/']);
    }

    refreshUser(): Observable<User> {
        return this.http.get<User>(`${environment.apiUrl}/auth/me`).pipe(
            tap(user => this._user.set(user))
        );
    }

    updateCredits(credits: number): void {
        const current = this._user();
        if (current) {
            this._user.set({ ...current, credits });
        }
    }

    private handleAuthSuccess(response: AuthResponse): void {
        localStorage.setItem('auth_token', response.token);
        this._user.set(response.user);
        this._isLoading.set(false);
    }

    private loadUserFromToken(): void {
        const token = localStorage.getItem('auth_token');
        if (token) {
            this.refreshUser().subscribe({
                error: () => {
                    localStorage.removeItem('auth_token');
                    this._user.set(null);
                }
            });
        }
    }
}
