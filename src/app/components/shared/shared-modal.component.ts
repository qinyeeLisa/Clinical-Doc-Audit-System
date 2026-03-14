import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-shared-modal',
  imports: [CommonModule],
  templateUrl: './shared-modal.component.html',
  styleUrl: './shared-modal.component.css',
})
export class SharedModalComponent {
  @Input() showModal = false;
  @Input() modalTitle = '';
  @Input() modalMessage = '';
  @Input() modalType: 'success' | 'error' = 'success';

  @Output() closeModal = new EventEmitter<void>();

  onClose() {
    this.closeModal.emit();
  }
}
