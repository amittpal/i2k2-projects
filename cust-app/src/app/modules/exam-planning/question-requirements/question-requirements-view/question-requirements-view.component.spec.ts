import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionRequirementsViewComponent } from './question-requirements-view.component';

describe('QuestionRequirementsViewComponent', () => {
  let component: QuestionRequirementsViewComponent;
  let fixture: ComponentFixture<QuestionRequirementsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionRequirementsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionRequirementsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
