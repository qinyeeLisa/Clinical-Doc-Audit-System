import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitNotesComponent } from './submit-notes.component';

describe('SubmitNotesComponent', () => {
  let component: SubmitNotesComponent;
  let fixture: ComponentFixture<SubmitNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitNotesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitNotesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
