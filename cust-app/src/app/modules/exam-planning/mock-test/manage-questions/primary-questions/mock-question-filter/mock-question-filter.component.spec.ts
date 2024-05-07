import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockQuestionFilterComponent } from './mock-question-filter.component';

describe('MockQuestionFilterComponent', () => {
  let component: MockQuestionFilterComponent;
  let fixture: ComponentFixture<MockQuestionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockQuestionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockQuestionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
