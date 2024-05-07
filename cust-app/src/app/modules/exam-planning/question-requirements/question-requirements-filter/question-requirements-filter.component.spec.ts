import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRequirementsFilterComponent } from './question-requirements-filter.component';

describe('QuestionRequirementsFilterComponent', () => {
  let component: QuestionRequirementsFilterComponent;
  let fixture: ComponentFixture<QuestionRequirementsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionRequirementsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionRequirementsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
