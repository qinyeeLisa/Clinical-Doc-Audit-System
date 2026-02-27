import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-submit-notes',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './submit-notes.component.html',
  styleUrls: ['./submit-notes.component.css'],
})
export class SubmitNotesComponent {
  constructor(private fb: FormBuilder) { }

  auditCaseForm!: FormGroup;

  // would normally be fetched from an API
  patients = [
    { id: 'patientA', name: 'Patient A' },
    { id: 'patientB', name: 'Patient B' },
    { id: 'patientC', name: 'Patient C' }
  ];

  ngOnInit(): void {
    // add patient selection and notes field
    this.auditCaseForm = this.fb.group({
      patient: ['', Validators.required],
      auditNotes: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.auditCaseForm.valid) {
      alert('Audit case data submitted: ' + JSON.stringify(this.auditCaseForm.value));
      // Call your audit submission API here
    } else {
      this.auditCaseForm.markAllAsTouched();
      console.log('Form invalid');
    }
  }
}
