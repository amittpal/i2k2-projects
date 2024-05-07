import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegFinalReviewComponent } from './reg-final-review.component';

describe('RegFinalReviewComponent', () => {
  let component: RegFinalReviewComponent;
  let fixture: ComponentFixture<RegFinalReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegFinalReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegFinalReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
