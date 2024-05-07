import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewRowdetailComponent } from './final-review-rowdetail.component';

describe('FinalReviewRowdetailComponent', () => {
  let component: FinalReviewRowdetailComponent;
  let fixture: ComponentFixture<FinalReviewRowdetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalReviewRowdetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalReviewRowdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
