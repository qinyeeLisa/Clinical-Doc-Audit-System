// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-clinical-details',
//   imports: [],
//   templateUrl: './clinical-details.component.html',
//   styleUrl: './clinical-details.component.css',
// })
// export class ClinicalDetailsComponent {

// }

import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

interface AuditCase {
  case_id: string;
  patient_id: string;
  user_id: string;
  status: string;
  risk_level: string | null;
  final_verdict: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string | null;
}

@Component({
  selector: 'app-clinical-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './clinical-details.component.html',
  styleUrls: ['./clinical-details.component.css']
})
export class ClinicalDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  // Change this to your API Gateway base URL
  private apiBaseUrl = 'https://ai6nsomr0m.execute-api.ap-southeast-1.amazonaws.com';

  caseData: AuditCase | null = null;
  loading = true;
  errorMessage = '';

  // Human review form
  showHumanReview = false;
  reviewerId = 'U001';
  decision = '';
  comments = '';
  submitting = false;
  submitMessage = '';
  submitError = '';

  ngOnInit(): void {
    const caseIdFromRoute = this.route.snapshot.paramMap.get('case_id');

    // fallback for testing if route param not ready yet
    const caseId = caseIdFromRoute || 'CASE-2024-002';

    this.loadCase(caseId);
  }

  loadCase(caseId: string): void {
    this.loading = true;
    this.errorMessage = '';

    this.http.get<AuditCase>(`${this.apiBaseUrl}/audit-cases/${caseId}`).subscribe({
      next: (data) => {
        this.caseData = data;
        this.showHumanReview = data.status === 'PENDING REVIEW';
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load case', err);
        this.errorMessage = err?.error?.error || 'Failed to load case details.';
        this.loading = false;
      }
    });
  }

  submitHumanReview(): void {
    if (!this.caseData) return;

    this.submitMessage = '';
    this.submitError = '';

    if (!this.reviewerId || !this.decision) {
      this.submitError = 'Reviewer ID and decision are required.';
      return;
    }

    this.submitting = true;

    const payload = {
      case_id: this.caseData.case_id,
      reviewer_id: this.reviewerId,
      decision: this.decision,
      comments: this.comments
    };

    this.http.post(`${this.apiBaseUrl}/human-reviews`, payload).subscribe({
      next: (res: any) => {
        this.submitMessage = 'Human review submitted successfully.';
        this.submitting = false;

        // Reload case so UI updates automatically
        this.loadCase(this.caseData!.case_id);
      },
      error: (err) => {
        console.error('Failed to submit human review', err);
        this.submitError = err?.error?.error || 'Failed to submit human review.';
        this.submitting = false;
      }
    });
  }

  get statusBadgeClass(): string {
    if (!this.caseData?.status) return 'status-default';

    switch (this.caseData.status) {
      case 'PENDING REVIEW':
        return 'status-pending';
      case 'COMPLETED':
        return 'status-completed';
      default:
        return 'status-default';
    }
  }

  get verdictText(): string {
    return this.caseData?.final_verdict || '-';
  }

  get riskText(): string {
    return this.caseData?.risk_level || '-';
  }
}