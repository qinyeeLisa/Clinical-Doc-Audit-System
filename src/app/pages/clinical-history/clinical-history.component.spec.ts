import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalHistoryComponent } from './clinical-history.component';

describe('ClinicalHistoryComponent', () => {
  let component: ClinicalHistoryComponent;
  let fixture: ComponentFixture<ClinicalHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalHistoryComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
