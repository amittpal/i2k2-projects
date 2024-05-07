import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewRowdetailViewComponent } from './final-review-rowdetail-view.component';

describe('FinalReviewRowdetailViewComponent', () => {
  let component: FinalReviewRowdetailViewComponent;
  let fixture: ComponentFixture<FinalReviewRowdetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalReviewRowdetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalReviewRowdetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
