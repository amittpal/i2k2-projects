import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EligibilityQualificationComponent } from './eligibility-qualification.component';

describe('EligibilityQualificationComponent', () => {
  let component: EligibilityQualificationComponent;
  let fixture: ComponentFixture<EligibilityQualificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EligibilityQualificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EligibilityQualificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
