import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsStatusSummaryComponent } from './questions-status-summary.component';

describe('QuestionsStatusSummaryComponent', () => {
  let component: QuestionsStatusSummaryComponent;
  let fixture: ComponentFixture<QuestionsStatusSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsStatusSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
