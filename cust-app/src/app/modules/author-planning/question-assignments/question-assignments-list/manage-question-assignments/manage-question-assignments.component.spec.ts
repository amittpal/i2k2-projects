import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageQuestionAssignmentsComponent } from './manage-question-assignments.component';

describe('ImportedAuthorsFilterComponent', () => {
  let component: ManageQuestionAssignmentsComponent;
  let fixture: ComponentFixture<ManageQuestionAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageQuestionAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageQuestionAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
