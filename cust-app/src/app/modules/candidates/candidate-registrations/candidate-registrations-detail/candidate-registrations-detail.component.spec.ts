import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRegistrationsDetailComponent } from './candidate-registrations-detail.component';

describe('CandidateRegistrationsDetailComponent', () => {
  let component: CandidateRegistrationsDetailComponent;
  let fixture: ComponentFixture<CandidateRegistrationsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateRegistrationsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegistrationsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
