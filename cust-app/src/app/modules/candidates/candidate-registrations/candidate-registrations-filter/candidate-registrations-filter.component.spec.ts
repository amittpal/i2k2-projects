import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRegistrationsFilterComponent } from './candidate-registrations-filter.component';

describe('CandidateRegistrationsFilterComponent', () => {
  let component: CandidateRegistrationsFilterComponent;
  let fixture: ComponentFixture<CandidateRegistrationsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateRegistrationsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRegistrationsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
