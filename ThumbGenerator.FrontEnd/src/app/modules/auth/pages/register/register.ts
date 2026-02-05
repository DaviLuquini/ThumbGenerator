import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>ThumbGenerator</h1>
          <p>Crie sua conta gratuitamente</p>
        </div>
        
        <form (ngSubmit)="onSubmit()" class="auth-form">
          @if (error()) {
            <div class="error-message">{{ error() }}</div>
          }
          
          <div class="form-group">
            <label for="name">Nome</label>
            <input 
              type="text" 
              id="name" 
              [(ngModel)]="name" 
              name="name"
              placeholder="Seu nome"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              [(ngModel)]="email" 
              name="email"
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              [(ngModel)]="password" 
              name="password"
              placeholder="••••••••"
              minlength="6"
              required
            />
          </div>
          
          <button type="submit" class="btn-primary" [disabled]="authService.isLoading()">
            @if (authService.isLoading()) {
              Criando conta...
            } @else {
              Criar conta
            }
          </button>
          
          <p class="credits-info">
            🎁 Você receberá <strong>10 créditos grátis</strong> ao se cadastrar!
          </p>
        </form>
        
        <div class="auth-footer">
          <p>Já tem uma conta? <a routerLink="/auth/login">Fazer login</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 1rem;
    }
    
    .auth-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 400px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .auth-header h1 {
      color: #fff;
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .auth-header p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .form-group label {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
    }
    
    .form-group input {
      padding: 0.875rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      color: #fff;
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.3);
    }
    
    .btn-primary {
      padding: 0.875rem;
      border: none;
      border-radius: 8px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s, transform 0.2s;
    }
    
    .btn-primary:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .error-message {
      padding: 0.75rem 1rem;
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      color: #f87171;
      font-size: 0.875rem;
    }
    
    .credits-info {
      text-align: center;
      color: rgba(255, 255, 255, 0.7);
      font-size: 0.875rem;
      padding: 0.75rem;
      background: rgba(102, 126, 234, 0.1);
      border-radius: 8px;
    }
    
    .credits-info strong {
      color: #667eea;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.875rem;
    }
    
    .auth-footer a {
      color: #667eea;
      text-decoration: none;
    }
    
    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterPage {
  authService = inject(AuthService);
  private router = inject(Router);

  name = '';
  email = '';
  password = '';
  error = signal<string | null>(null);

  onSubmit(): void {
    this.error.set(null);

    if (!this.name || !this.email || !this.password) {
      this.error.set('Preencha todos os campos');
      return;
    }

    if (this.password.length < 6) {
      this.error.set('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password
    }).subscribe({
      next: () => {
        this.router.navigate(['/app']);
      },
      error: (err) => {
        this.error.set(err.error?.error || 'Erro ao criar conta');
      }
    });
  }
}
