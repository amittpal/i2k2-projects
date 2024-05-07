import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FillBlankReviewComponent } from './fill-blank-review.component';

describe('FillBlankReviewComponent', () => {
  let component: FillBlankReviewComponent;
  let fixture: ComponentFixture<FillBlankReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FillBlankReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FillBlankReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
