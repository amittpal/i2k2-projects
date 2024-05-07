import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MockQuestionFilterSecondaryComponent } from './mock-question-filter-secondary.component';

describe('MockQuestionFilterSecondaryComponent', () => {
  let component: MockQuestionFilterSecondaryComponent;
  let fixture: ComponentFixture<MockQuestionFilterSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MockQuestionFilterSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockQuestionFilterSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
