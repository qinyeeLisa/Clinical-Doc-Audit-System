import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../../constants';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService
  ) { }
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;

      const payload = {
        email: formValue.email,
        password: formValue.password,
      };

      this.isLoading = true;
      this.errorMessage = null;

      this.http.post(`${API_URL}/login`, payload).subscribe(
        response => {
          console.log('Login successful', response);
          const loginResponse = response as any;
          const userId =
            loginResponse?.user?.user_id || null;
          if (userId) {
            this.auth.setUserId(userId);
          }

          this.loginForm.reset();
          this.isLoading = false;
          this.router.navigate(['/submit-notes']);
        },
        error => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message ||
            'Login failed. Please check your credentials and try again.';
          this.cd.detectChanges();
        }
      );


    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
