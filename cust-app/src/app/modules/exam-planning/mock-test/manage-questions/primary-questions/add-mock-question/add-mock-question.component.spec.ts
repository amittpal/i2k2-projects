import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMockQuestionComponent } from './add-mock-question.component';

describe('AddMockQuestionComponent', () => {
  let component: AddMockQuestionComponent;
  let fixture: ComponentFixture<AddMockQuestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMockQuestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMockQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
