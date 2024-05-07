import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMockQuestionSecondaryComponent } from './add-mock-question-secondary.component';

describe('AddMockQuestionSecondaryComponent', () => {
  let component: AddMockQuestionSecondaryComponent;
  let fixture: ComponentFixture<AddMockQuestionSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMockQuestionSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMockQuestionSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
