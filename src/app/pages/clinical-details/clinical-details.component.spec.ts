import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalDetailsComponent } from './clinical-details.component';

describe('ClinicalDetailsComponent', () => {
  let component: ClinicalDetailsComponent;
  let fixture: ComponentFixture<ClinicalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicalDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
