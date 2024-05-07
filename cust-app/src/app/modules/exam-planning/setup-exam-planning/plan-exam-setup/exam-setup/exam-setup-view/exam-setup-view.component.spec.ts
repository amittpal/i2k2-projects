import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamSetupViewComponent } from './exam-setup-view.component';

describe('ExamSetupViewComponent', () => {
  let component: ExamSetupViewComponent;
  let fixture: ComponentFixture<ExamSetupViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSetupViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSetupViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
