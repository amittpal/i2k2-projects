import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullQuestionViewComponent } from './full-question-view.component';

describe('FullQuestionViewComponent', () => {
  let component: FullQuestionViewComponent;
  let fixture: ComponentFixture<FullQuestionViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullQuestionViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullQuestionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
