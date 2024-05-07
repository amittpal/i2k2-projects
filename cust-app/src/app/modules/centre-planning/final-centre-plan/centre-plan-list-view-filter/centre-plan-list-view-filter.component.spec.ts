import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrePlanListViewFilterComponent } from './centre-plan-list-view-filter.component';

describe('CentrePlanListViewFilterComponent', () => {
  let component: CentrePlanListViewFilterComponent;
  let fixture: ComponentFixture<CentrePlanListViewFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentrePlanListViewFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentrePlanListViewFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
