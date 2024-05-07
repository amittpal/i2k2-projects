import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardExamViewComponent } from './admit-card-exam-view.component';

describe('AdmitCardExamViewComponent', () => {
  let component: AdmitCardExamViewComponent;
  let fixture: ComponentFixture<AdmitCardExamViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardExamViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardExamViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
