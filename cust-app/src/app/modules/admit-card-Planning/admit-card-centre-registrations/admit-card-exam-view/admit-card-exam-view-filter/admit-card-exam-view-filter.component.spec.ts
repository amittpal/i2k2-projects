import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardExamViewFilterComponent } from './admit-card-exam-view-filter.component';

describe('AdmitCardExamViewFilterComponent', () => {
  let component: AdmitCardExamViewFilterComponent;
  let fixture: ComponentFixture<AdmitCardExamViewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardExamViewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardExamViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
