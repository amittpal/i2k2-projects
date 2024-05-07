import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRequirementsListComponent } from './question-requirements-list.component';

describe('QuestionRequirementsListComponent', () => {
  let component: QuestionRequirementsListComponent;
  let fixture: ComponentFixture<QuestionRequirementsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionRequirementsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionRequirementsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
