import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReviewViewComponent } from './final-review-view.component';

describe('FinalReviewViewComponent', () => {
  let component: FinalReviewViewComponent;
  let fixture: ComponentFixture<FinalReviewViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalReviewViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalReviewViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
