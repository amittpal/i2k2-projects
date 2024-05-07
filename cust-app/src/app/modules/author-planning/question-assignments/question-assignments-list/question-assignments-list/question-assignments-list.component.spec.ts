import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionAssignmentsListComponent } from './question-assignments-list.component';

describe('AuthorPlanningListComponent', () => {
  let component: QuestionAssignmentsListComponent;
  let fixture: ComponentFixture<QuestionAssignmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionAssignmentsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionAssignmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
