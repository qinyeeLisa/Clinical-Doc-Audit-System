import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-submit-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './submit-notes.component.html',
  styleUrls: ['./submit-notes.component.css'],
})
export class SubmitNotesComponent {
  constructor(private fb: FormBuilder, private http: HttpClient, private cd: ChangeDetectorRef
  ) { }

  auditCaseForm!: FormGroup;

  patients: any[] = [];
  showModal = false;
  modalTitle = '';
  modalMessage = '';
  modalType: 'success' | 'error' = 'success';

  ngOnInit(): void {
    this.getPatientsData();

    this.auditCaseForm = this.fb.group({
      patient: ['', Validators.required],
      auditNotes: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.auditCaseForm.valid) {
      const formValue = this.auditCaseForm.value;

      const payload = {
        user_id: 'user_123',
        patient_id: formValue.patient,
        raw_note_text: formValue.auditNotes
      };

      console.log('Submitting payload', payload);

      this.http.post(`${API_URL}/audit-cases`, payload).subscribe(
        response => {
          console.log('Note submitted successfully', response);

          this.modalTitle = 'Success';
          this.modalMessage = 'Audit note submitted successfully.';
          this.modalType = 'success';
          this.showModal = true;

          this.auditCaseForm.reset();
        },
        error => {
          console.error('Error submitting note', error);

          this.modalTitle = 'Submission Failed';
          this.modalMessage = 'Something went wrong while submitting the note. Please try again.';
          this.modalType = 'error';
          this.showModal = true;
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
}
