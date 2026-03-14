import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SharedModalComponent } from '../../components/shared/shared-modal.component';
import { API_URL } from '../../constants';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SharedModalComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';


  constructor(private fb: FormBuilder, private http: HttpClient) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNo: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      role: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const payload = {
        user_id: 'user_123',
        patient_id: formValue.patient,
        doctor_notes: formValue.auditNotes
      };

      this.http.post(`${API_URL}/audit-cases`, payload).subscribe(
        response => {
          console.log('User registered successfully', response);

          this.modalTitle = 'Success';
          this.modalMessage = 'User registered successfully.';
          this.modalType = 'success';
          this.showModal = true;

          this.registerForm.reset();
        },
        error => {
          console.error('Error registering user', error);

          this.modalTitle = 'Registration Failed';
          this.modalMessage = 'Something went wrong while registering the user. Please try again.';
          this.modalType = 'error';
          this.showModal = true;
        }
      );

      this.registerForm.reset();
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  onCloseModal(): void {
    this.showModal = false;
  }
}
