import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrueFalseReviewComponent } from './true-false-review.component';

describe('TrueFalseReviewComponent', () => {
  let component: TrueFalseReviewComponent;
  let fixture: ComponentFixture<TrueFalseReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrueFalseReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrueFalseReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
