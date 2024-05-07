import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanExamsFilterComponent } from './plan-exams-filter.component';

describe('PlanExamsFilterComponent', () => {
  let component: PlanExamsFilterComponent;
  let fixture: ComponentFixture<PlanExamsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanExamsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanExamsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
