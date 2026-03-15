import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { API_URL } from '../../constants';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  errorMessage: string | null = null;
  isLoading = false;


  constructor(private fb: FormBuilder, private http: HttpClient,
    private cd: ChangeDetectorRef, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const payload = {
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
        contact_no: formValue.contactNo,
        role: formValue.role
      };

      this.http.post(`${API_URL}/users`, payload).subscribe(
        response => {
          console.log('User registered successfully', response);
          this.registerForm.reset();
          this.isLoading = false;
          this.router.navigate(['/login']);

        },
        error => {
          this.isLoading = false;
          this.errorMessage =
            error?.error?.message ||
            'Registration failed. Please check your input and try again.';
          this.cd.detectChanges();
        }
      );

    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }
}
