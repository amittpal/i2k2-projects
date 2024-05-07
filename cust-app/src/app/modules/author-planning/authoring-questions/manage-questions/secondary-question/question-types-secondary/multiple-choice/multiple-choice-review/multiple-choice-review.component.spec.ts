import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleChoiceReviewComponent } from './multiple-choice-review.component';

describe('MultipleChoiceReviewComponent', () => {
  let component: MultipleChoiceReviewComponent;
  let fixture: ComponentFixture<MultipleChoiceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultipleChoiceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultipleChoiceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
