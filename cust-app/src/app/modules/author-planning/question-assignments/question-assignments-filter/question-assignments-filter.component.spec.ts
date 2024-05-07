import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAssignmentsFilterComponent } from './question-assignments-filter.component';

describe('ImportedAuthorsFilterComponent', () => {
  let component: QuestionAssignmentsFilterComponent;
  let fixture: ComponentFixture<QuestionAssignmentsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAssignmentsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAssignmentsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
