import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockQuestionHeaderComponent } from './mock-question-header.component';

describe('MockQuestionHeaderComponent', () => {
  let component: MockQuestionHeaderComponent;
  let fixture: ComponentFixture<MockQuestionHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockQuestionHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockQuestionHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
