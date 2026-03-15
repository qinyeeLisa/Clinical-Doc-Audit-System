import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface AuditCase {
  case_id: string;
  patient_id: string;
  user_id: string;
  status: string;
  risk_level: string | null;
  final_verdict: string | null;
  doctor_notes: string | null;
  orchestrator_summary?: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string | null;
}

interface AuditExplanation {
  case_id: string;
  final_verdict: string;
  confidence: number;
  agent1_summary: string;
  compliance_findings: string[];
  consistency_findings: string[];
  risk_findings: string[];
}

@Component({
  selector: 'app-clinical-details',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './clinical-details.component.html',
  styleUrls: ['./clinical-details.component.css']
})
export class ClinicalDetailsComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private cd = inject(ChangeDetectorRef);

  private apiBaseUrl = 'https://ai6nsomr0m.execute-api.ap-southeast-1.amazonaws.com';
  private auth = inject(AuthService);

  caseData: AuditCase | null = null;
  loading = true;
  explanationData: AuditExplanation | null = null;
  explanationLoading = false;
  errorMessage = '';
  userId: string | null = this.auth.userId;

  showHumanReview = false;
  reviewerId = 'U001';
  decision = '';
  comments = '';
  submitting = false;
  submitMessage = '';
  submitError = '';

  ngOnInit(): void {
    // Keep userId in sync with the current logged-in user
    this.auth.userId$.subscribe(id => {
      this.userId = id;
    });

    const caseId = this.route.snapshot.paramMap.get('case_id');
    console.log('Route case_id:', caseId);

    if (!caseId) {
      this.errorMessage = 'Missing case_id in route';
      this.loading = false;
      this.cd.detectChanges();
      return;
    }

    this.loadCase(caseId);
  }

  loadCase(caseId: string): void {
    this.loading = true;
    this.errorMessage = '';
    this.explanationLoading = true;
    this.explanationData = null;
    this.cd.detectChanges();

    const caseUrl = `${this.apiBaseUrl}/audit-cases/${caseId}`;
    const explanationUrl = `${this.apiBaseUrl}/audit-cases/${caseId}/explanation`;

    console.log('Calling case API:', caseUrl);
    console.log('Calling explanation API:', explanationUrl);

    this.http.get<AuditCase>(caseUrl).subscribe({
      next: (data) => {
        console.log('Case API success:', data);

        this.caseData = data;
        this.showHumanReview = data.status === 'PENDING REVIEW';
        this.loading = false;
        this.cd.detectChanges();

        this.http.get<AuditExplanation>(explanationUrl).subscribe({
          next: (explanation) => {
            console.log('Explanation API success:', explanation);
            this.explanationData = explanation;
            this.explanationLoading = false;
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Explanation API error:', err);
            this.explanationLoading = false;
            this.cd.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Case API error:', err);

        this.errorMessage = err?.error?.error || 'Failed to load case details.';
        this.loading = false;
        this.explanationLoading = false;
        this.cd.detectChanges();
      }
    });
  }

  submitHumanReview(): void {
    if (!this.caseData) return;

    this.submitMessage = '';
    this.submitError = '';

    if (!this.reviewerId || !this.decision) {
      this.submitError = 'Reviewer ID and decision are required.';
      this.cd.detectChanges();
      return;
    }

    this.submitting = true;
    this.cd.detectChanges();

    const payload = {
      case_id: this.caseData.case_id,
      reviewer_id: this.reviewerId,
      decision: this.decision,
      comments: this.comments
    };

    this.http.post(`${this.apiBaseUrl}/human-reviews`, payload).subscribe({
      next: () => {
        this.submitMessage = 'Human review submitted successfully.';
        this.submitting = false;
        this.cd.detectChanges();

        this.loadCase(this.caseData!.case_id);
      },
      error: (err) => {
        console.error('Submit error:', err);

        this.submitError = err?.error?.error || 'Failed to submit human review.';
        this.submitting = false;
        this.cd.detectChanges();
      }
    });
  }

  get verdictText(): string {
    return this.caseData?.final_verdict || '-';
  }

  get riskText(): string {
    return this.caseData?.risk_level || '-';
  }
}