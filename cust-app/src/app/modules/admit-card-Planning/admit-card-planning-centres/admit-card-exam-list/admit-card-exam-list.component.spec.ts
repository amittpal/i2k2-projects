import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdmitCardExamListComponent } from './admit-card-exam-list.component';

describe('AdmitCardExamListComponent', () => {
  let component: AdmitCardExamListComponent;
  let fixture: ComponentFixture<AdmitCardExamListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdmitCardExamListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdmitCardExamListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
