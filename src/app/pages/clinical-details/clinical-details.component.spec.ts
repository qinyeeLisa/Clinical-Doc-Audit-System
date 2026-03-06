import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClinicalDetailsComponent } from './clinical-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

describe('ClinicalDetailsComponent', () => {
  let component: ClinicalDetailsComponent;
  let fixture: ComponentFixture<ClinicalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicalDetailsComponent],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ClinicalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});