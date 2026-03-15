import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { API_URL } from '../../constants';
import { HttpClient } from '@angular/common/http';
import { SharedModalComponent } from '../../components/shared/shared-modal.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-submit-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModalComponent],
  templateUrl: './submit-notes.component.html',
  styleUrls: ['./submit-notes.component.css'],
})
export class SubmitNotesComponent {
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  auditCaseForm!: FormGroup;

  patients: any[] = [];
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';
  isSubmitting = false;

  // Hard-coded feedback values (no backend results)
  completeness: number | null = null;

  ngOnInit(): void {
    this.getPatientsData();

    this.auditCaseForm = this.fb.group({
      patient: ['', Validators.required],
      auditNotes: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.auditCaseForm.valid) {
      this.isSubmitting = true;
      const formValue = this.auditCaseForm.value;

      const payload = {
        user_id: this.auth.userId ?? 'user_123',
        patient_id: formValue.patient,
        doctor_notes: formValue.auditNotes
      };

      console.log('Submitting payload', payload);

      this.http.post(`${API_URL}/audit-cases`, payload).subscribe(
        response => {
          console.log('Note submitted successfully', response);

          // Hard-coded completion/compliance scores (no backend results available)
          this.completeness = 100;

          this.modalTitle = 'Success';
          this.modalMessage = 'Audit note submitted successfully.';
          this.modalType = 'success';
          this.showModal = true;

          this.auditCaseForm.reset();
          this.isSubmitting = false;
          this.cd.detectChanges();

        },
        error => {
          console.error('Error submitting note', error);

          this.modalTitle = 'Submission Failed';
          this.modalMessage = 'Something went wrong while submitting the note. Please try again.';
          this.modalType = 'error';
          this.showModal = true;
          this.isSubmitting = false;
        }
      );

    } else {
      this.auditCaseForm.markAllAsTouched();
    }
  }

  getPatientsData(): void {
    this.http.get<any[]>(`${API_URL}/patients`,).subscribe(data => {
      this.patients = [data];
      this.cd.detectChanges();

    });
  }

  onCloseModal(): void {
    this.showModal = false;
  }
}
