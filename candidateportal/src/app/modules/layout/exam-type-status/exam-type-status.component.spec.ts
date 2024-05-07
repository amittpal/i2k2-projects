import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTypeStatusComponent } from './exam-type-status.component';

describe('ExamTypeStatusComponent', () => {
  let component: ExamTypeStatusComponent;
  let fixture: ComponentFixture<ExamTypeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamTypeStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamTypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
