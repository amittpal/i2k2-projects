import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRegistrationsComponent } from './candidate-registrations.component';

describe('CandidateRegistrationsComponent', () => {
  let component: CandidateRegistrationsComponent;
  let fixture: ComponentFixture<CandidateRegistrationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateRegistrationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
