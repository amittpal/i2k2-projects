import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignQuestionsComponent } from './assign-questions.component';

describe('ImportedAuthorsFilterComponent', () => {
  let component: AssignQuestionsComponent;
  let fixture: ComponentFixture<AssignQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
