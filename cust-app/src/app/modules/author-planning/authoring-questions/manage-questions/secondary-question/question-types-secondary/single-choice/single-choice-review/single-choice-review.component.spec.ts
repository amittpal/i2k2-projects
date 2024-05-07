import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleChoiceReviewComponent } from './single-choice-review.component';

describe('SingleChoiceReviewComponent', () => {
  let component: SingleChoiceReviewComponent;
  let fixture: ComponentFixture<SingleChoiceReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleChoiceReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleChoiceReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
