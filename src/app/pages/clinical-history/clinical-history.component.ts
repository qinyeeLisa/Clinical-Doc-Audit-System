import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { API_URL } from '../../constants';

@Component({
  selector: 'app-clinical-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clinical-history.component.html',
  styleUrls: ['./clinical-history.component.css'],
  providers: [DatePipe]
})
export class ClinicalHistoryComponent {
  auditCases: any[] = [];

  constructor(
    private router: Router,
    private http: HttpClient,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getAllAuditCases();
  }

  navigateToSubmitNotes(): void {
    this.router.navigate(['/submit-notes']);
  }

  getAllAuditCases(): void {
    this.http.get<any>(`${API_URL}/audit-cases`).subscribe({
      next: (data) => {
        // Make sure auditCases is an array of items
        this.auditCases = data.items || [];
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch audit cases', err);
      }
    });
  }

  // Helper to format date for display
  formatDate(dateStr: string): string | null {
    return this.datePipe.transform(dateStr, 'MMM d, y'); // e.g., Feb 28, 2026
  }
}