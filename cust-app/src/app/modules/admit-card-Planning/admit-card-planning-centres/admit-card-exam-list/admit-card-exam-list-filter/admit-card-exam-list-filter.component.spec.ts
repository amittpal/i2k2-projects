import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardExamListFilterComponent } from './admit-card-exam-list-filter.component';

describe('AdmitCardExamListFilterComponent', () => {
  let component: AdmitCardExamListFilterComponent;
  let fixture: ComponentFixture<AdmitCardExamListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardExamListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardExamListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
